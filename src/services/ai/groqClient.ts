import type Groq from 'groq-sdk';

// Calls Groq's free tier straight from the browser, so the key ships in the JS bundle and anyone can copy it.
// Use a key from a Groq account with no payment card: the worst case is someone using up the free quota,
// which turns the AI features off until it resets. Move these calls behind the backend once there are endpoints for them.
// Groq doesn't train on API data or keep it by default (see console.groq.com/docs/your-data).
const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export const isGroqAvailable = Boolean(apiKey);

let clientPromise: Promise<{ client: Groq; GroqSdk: typeof Groq }> | null = null;

// Load the SDK on first use so it stays out of the main bundle.
export const getGroqClient = () => {
  clientPromise ??= import('groq-sdk').then(({ default: GroqSdk }) => ({
    GroqSdk,
    client: new GroqSdk({ apiKey, dangerouslyAllowBrowser: true, timeout: 30_000, maxRetries: 1 }),
  }));
  return clientPromise;
};

/** A message for the user explaining a failed Groq call, or `fallback` when the cause is unknown. */
export const groqErrorMessage = (error: unknown, sdk: typeof Groq, fallback: string): string => {
  if (error instanceof sdk.AuthenticationError || error instanceof sdk.PermissionDeniedError) {
    return 'The AI service is not set up correctly (API key rejected).';
  }
  if (error instanceof sdk.RateLimitError) return 'The free AI limit has been reached. Try again shortly.';
  if (error instanceof sdk.APIConnectionError) return "Couldn't reach the AI service. Check your connection.";
  if (error instanceof sdk.InternalServerError) return 'The AI service is busy. Try again in a minute.';
  return fallback;
};
