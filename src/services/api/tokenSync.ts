/**
 * Keeps browser tabs that share one login in step.
 *
 * Tokens live in sessionStorage, which is per tab — but "Duplicate tab" copies it, so two
 * tabs can end up holding the same refresh token. The backend accepts a refresh token only
 * once, so the tab that refreshed second would get 401 and be logged out. To prevent that,
 * the tabs of one login:
 *  - refresh one at a time (Web Locks API), and
 *  - send each other the new tokens over a BroadcastChannel, encrypted with a random key
 *    created at login and stored next to the tokens. A duplicated tab inherits the key along
 *    with the tokens; any other tab (e.g. a second account in another tab) can't read them.
 *
 * Without BroadcastChannel or WebCrypto (old browsers, plain-http origins) this is a no-op
 * and every tab refreshes on its own, as before.
 */

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenSyncHost {
  /** The tab's token storage; the sync key is kept next to the tokens */
  storage(): Storage;
  getTokens(): SessionTokens | null;
  /** Store tokens that another tab of this login got from a refresh */
  adoptTokens(tokens: SessionTokens): void;
}

type SyncMessage =
  // A tab's current tokens: sent after it refreshed, or in answer to 'sync'
  | { type: 'tokens'; session: string; seq: number; iv: string; data: string }
  // "Has any tab of this login refreshed more than `seq` times?"
  | { type: 'sync'; session: string; seq: number };

interface SessionKeys {
  /** Identifies the login on the channel without revealing the key */
  id: string;
  key: CryptoKey;
}

const CHANNEL_NAME = 'workfloow-auth';
const LOCK_NAME = 'workfloow-token-refresh';
const SECRET_STORAGE_KEY = 'app_token_sync_secret';
// How many refreshes this login has had, so a tab can tell newer tokens from older ones
const SEQ_STORAGE_KEY = 'app_token_sync_seq';
// Other tabs answer within milliseconds; this only bounds the wait when none is left
const SYNC_TIMEOUT_MS = 1000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes));
const fromBase64 = (text: string): Uint8Array<ArrayBuffer> =>
  Uint8Array.from(atob(text), (char) => char.charCodeAt(0));

const sha256 = (text: string): Promise<ArrayBuffer> => crypto.subtle.digest('SHA-256', encoder.encode(text));

async function deriveKeys(secret: string): Promise<SessionKeys> {
  // Separate derivations, so the id that goes on the channel tells nothing about the key
  const [id, keyBytes] = await Promise.all([sha256(`id:${secret}`), sha256(`key:${secret}`)]);
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt', 'decrypt']);
  return { id: toBase64(new Uint8Array(id)), key };
}

// seq is authenticated with the tokens, so an old message can't be replayed as a newer one
const sealParams = (iv: Uint8Array<ArrayBuffer>, seq: number): AesGcmParams =>
  ({ name: 'AES-GCM', iv, additionalData: encoder.encode(String(seq)) });

async function seal(key: CryptoKey, tokens: SessionTokens, seq: number): Promise<{ iv: string; data: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt(sealParams(iv, seq), key, encoder.encode(JSON.stringify(tokens)));
  return { iv: toBase64(iv), data: toBase64(new Uint8Array(data)) };
}

async function unseal(key: CryptoKey, seq: number, iv: string, data: string): Promise<SessionTokens | null> {
  try {
    const plain = await crypto.subtle.decrypt(sealParams(fromBase64(iv), seq), key, fromBase64(data));
    const tokens = JSON.parse(decoder.decode(plain)) as Partial<SessionTokens>;
    return typeof tokens.accessToken === 'string' && typeof tokens.refreshToken === 'string'
      ? { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }
      : null;
  } catch {
    return null;
  }
}

function isSyncMessage(data: unknown): data is SyncMessage {
  if (typeof data !== 'object' || data === null) return false;
  const message = data as Record<string, unknown>;
  if (typeof message.session !== 'string' || !Number.isSafeInteger(message.seq)) return false;
  return message.type === 'sync'
    || (message.type === 'tokens' && typeof message.iv === 'string' && typeof message.data === 'string');
}

export class TokenSync {
  private readonly host: TokenSyncHost;
  private readonly channel: BroadcastChannel | null;
  // Incoming messages that are still being decrypted
  private readonly pending = new Set<Promise<void>>();
  private readonly adoptionListeners = new Set<() => void>();
  private keysCache: { secret: string; keys: Promise<SessionKeys> } | null = null;

  constructor(host: TokenSyncHost) {
    this.host = host;
    const supported = typeof BroadcastChannel !== 'undefined' && !!globalThis.crypto?.subtle;
    this.channel = supported ? new BroadcastChannel(CHANNEL_NAME) : null;
    if (!this.channel) return;

    this.channel.onmessage = (event: MessageEvent<unknown>) => this.track(this.handle(event.data));
    // A login from before this code shipped has no sync key yet
    if (host.getTokens()) this.secret(true);
  }

  /** A new login in this tab: only tabs duplicated from now on share it */
  startSession(): void {
    if (!this.channel) return;
    this.remove(SECRET_STORAGE_KEY);
    this.secret(true);
  }

  endSession(): void {
    this.remove(SECRET_STORAGE_KEY);
    this.remove(SEQ_STORAGE_KEY);
  }

  /** Runs `fn` holding the cross-tab refresh lock, after applying token updates that already arrived */
  async withRefreshLock<T>(fn: () => Promise<T>): Promise<T> {
    const run = async (): Promise<T> => {
      await this.settle();
      return fn();
    };
    const locks = globalThis.navigator?.locks;
    return locks ? locks.request(LOCK_NAME, run) : run();
  }

  /** Waits for token updates that have arrived and are still being decrypted */
  async settle(): Promise<void> {
    await Promise.all(this.pending);
  }

  /** Sends the tokens this tab just got from a refresh to the other tabs of its login */
  async announce(tokens: SessionTokens): Promise<void> {
    const channel = this.channel;
    const secret = channel ? this.secret(true) : null;
    if (!channel || !secret) return;

    const seq = this.seq() + 1;
    this.write(SEQ_STORAGE_KEY, String(seq));
    try {
      const { id, key } = await this.keys(secret);
      channel.postMessage({ type: 'tokens', session: id, seq, ...(await seal(key, tokens, seq)) } satisfies SyncMessage);
    } catch (error) {
      console.warn('Could not share refreshed tokens with other tabs:', error);
    }
  }

  /**
   * Asks the other tabs of this login for newer tokens than ours — for a tab whose refresh
   * token was rejected because a duplicate refreshed while this tab was frozen or discarded.
   * Resolves true once newer tokens have been adopted.
   */
  async requestNewerTokens(): Promise<boolean> {
    const channel = this.channel;
    const secret = this.secret(false);
    if (!channel || !secret) return false;

    const seqBefore = this.seq();
    let id: string;
    try {
      ({ id } = await this.keys(secret));
    } catch {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      const finish = () => {
        clearTimeout(timer);
        this.adoptionListeners.delete(finish);
        resolve(this.seq() > seqBefore);
      };
      const timer = setTimeout(finish, SYNC_TIMEOUT_MS);
      this.adoptionListeners.add(finish);
      channel.postMessage({ type: 'sync', session: id, seq: seqBefore } satisfies SyncMessage);
    });
  }

  private track(work: Promise<void>): void {
    const tracked: Promise<void> = work
      .catch((error) => console.warn('Ignoring token sync message:', error))
      .finally(() => this.pending.delete(tracked));
    this.pending.add(tracked);
  }

  private async handle(data: unknown): Promise<void> {
    const secret = this.secret(false);
    if (!secret || !isSyncMessage(data)) return;
    const { id, key } = await this.keys(secret);
    if (data.session !== id) return; // another login's tabs

    if (data.type === 'tokens' && data.seq > this.seq()) {
      const tokens = await unseal(key, data.seq, data.iv, data.data);
      // Our own refresh, a logout or a newer message may have moved this tab on meanwhile
      if (!tokens || data.seq <= this.seq() || this.secret(false) !== secret) return;
      this.write(SEQ_STORAGE_KEY, String(data.seq));
      this.host.adoptTokens(tokens);
      this.adoptionListeners.forEach((listener) => listener());
    } else if (data.type === 'sync' && data.seq < this.seq()) {
      const seq = this.seq();
      const tokens = this.host.getTokens();
      if (tokens) {
        this.channel?.postMessage({ type: 'tokens', session: id, seq, ...(await seal(key, tokens, seq)) } satisfies SyncMessage);
      }
    }
  }

  private secret(create: boolean): string | null {
    const existing = this.read(SECRET_STORAGE_KEY);
    if (existing || !create) return existing;
    const secret = toBase64(crypto.getRandomValues(new Uint8Array(32)));
    this.write(SECRET_STORAGE_KEY, secret);
    this.write(SEQ_STORAGE_KEY, '0');
    return secret;
  }

  private seq(): number {
    return Number(this.read(SEQ_STORAGE_KEY)) || 0;
  }

  private keys(secret: string): Promise<SessionKeys> {
    if (this.keysCache?.secret !== secret) {
      this.keysCache = { secret, keys: deriveKeys(secret) };
    }
    return this.keysCache.keys;
  }

  private read(key: string): string | null {
    try {
      return this.host.storage().getItem(key);
    } catch {
      return null;
    }
  }

  private write(key: string, value: string): void {
    try {
      this.host.storage().setItem(key, value);
    } catch {
      // Storage unavailable: tabs simply won't sync
    }
  }

  private remove(key: string): void {
    try {
      this.host.storage().removeItem(key);
    } catch {
      // Storage unavailable: nothing stored to remove
    }
  }
}
