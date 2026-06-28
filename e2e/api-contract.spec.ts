import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAuthToken, apiGet } from './helpers/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SchemaObject {
  type?: string;
  $ref?: string;
  required?: string[];
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
}

interface OpenApiSpec {
  paths?: Record<string, Record<string, unknown>>;
  components?: { schemas?: Record<string, SchemaObject> };
}

// ─── Spec loading ─────────────────────────────────────────────────────────────

const SPEC_PATH = join(process.cwd(), 'openapi-spec.json');

function loadSpec(): OpenApiSpec | null {
  if (!existsSync(SPEC_PATH)) return null;
  try {
    return JSON.parse(readFileSync(SPEC_PATH, 'utf-8')) as OpenApiSpec;
  } catch {
    return null;
  }
}

// ─── Schema validation ────────────────────────────────────────────────────────

function resolveRef(spec: OpenApiSpec, ref: string): SchemaObject | null {
  const parts = ref.replace(/^#\//, '').split('/');
  let current: unknown = spec;
  for (const part of parts) {
    if (typeof current !== 'object' || current === null) return null;
    current = (current as Record<string, unknown>)[decodeURIComponent(part)];
  }
  return (current as SchemaObject) ?? null;
}

function validateSchema(body: unknown, schema: SchemaObject, spec: OpenApiSpec, depth = 0): string[] {
  if (depth > 2) return [];
  const errors: string[] = [];
  const resolved = schema.$ref ? resolveRef(spec, schema.$ref) : schema;
  if (!resolved) return errors;

  if (resolved.type === 'array') {
    if (!Array.isArray(body)) errors.push(`expected array, got ${typeof body}`);
  } else if (resolved.type === 'object' || resolved.properties) {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      errors.push(`expected object, got ${Array.isArray(body) ? 'array' : typeof body}`);
    } else {
      const obj = body as Record<string, unknown>;
      for (const field of resolved.required ?? []) {
        if (!(field in obj)) errors.push(`required field "${field}" missing`);
      }
    }
  }
  return errors;
}

function getResponseSchema(spec: OpenApiSpec, specPath: string): SchemaObject | null {
  const pathItem = spec.paths?.[specPath];
  if (!pathItem) return null;
  const get = pathItem.get as Record<string, unknown> | undefined;
  const responses = get?.responses as Record<string, unknown> | undefined;
  const ok = responses?.['200'] as Record<string, unknown> | undefined;
  const content = ok?.content as Record<string, unknown> | undefined;
  const appJson = content?.['application/json'] as Record<string, unknown> | undefined;
  return (appJson?.schema as SchemaObject) ?? null;
}

// ─── Path utilities ───────────────────────────────────────────────────────────

interface PathCategories {
  simplePaths: string[];
  paramPaths: string[];
}

function categorizePaths(spec: OpenApiSpec): PathCategories {
  const simplePaths: string[] = [];
  const paramPaths: string[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    const item = pathItem as Record<string, unknown>;
    const hasPathParam = path.includes('{');

    if (item.get) {
      if (!hasPathParam) simplePaths.push(path);
      else paramPaths.push(path);
    }
  }

  return { simplePaths, paramPaths };
}

// Extract a resource ID from a list or single response body
function extractId(body: unknown): string | number | null {
  if (!body || typeof body !== 'object') return null;
  const obj = body as Record<string, unknown>;

  // Paginated: { content: [{ id, ... }] }
  if (Array.isArray(obj.content) && obj.content.length > 0) {
    const first = obj.content[0] as Record<string, unknown>;
    return (first.id ?? first.assignmentId ?? null) as string | number | null;
  }

  // Plain array
  if (Array.isArray(body) && body.length > 0) {
    const first = body[0] as Record<string, unknown>;
    return (first.id ?? null) as string | number | null;
  }

  // Single object
  if ('id' in obj) return obj.id as string | number;

  return null;
}

// Find the list path that corresponds to a param path
// e.g. /api/v1/jobs/{jobId} → /api/v1/jobs
function findListPath(paramPath: string, simplePaths: string[]): string | null {
  const base = paramPath.replace(/\/\{[^}]+\}.*$/, '');
  return simplePaths.find(p => p === base) ?? null;
}

function fillPathParams(path: string, id: string | number): string {
  return path.replace(/\{[^}]+\}/g, String(id));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

const spec = loadSpec();
const hasCredentials = !!(process.env.TEST_USER_USERNAME && process.env.TEST_USER_PASSWORD);

// Comma-separated list of paths to skip — set via SKIP_PATHS env var in the workflow
// e.g. SKIP_PATHS=/api/v1/companies/members/invitations/check,/api/v1/other
const SKIP_PATHS = new Set(
  (process.env.SKIP_PATHS ?? '').split(',').map(p => p.trim()).filter(Boolean),
);

if (!spec) {
  test('OpenAPI spec not found — skipping contract tests', () => {
    console.log(`No spec at ${SPEC_PATH}. It is downloaded in CI before this step runs.`);
  });
} else {
  const { simplePaths, paramPaths } = categorizePaths(spec);

  test.describe('API Contract Tests', () => {
    let token = '';
    // List path → first resource ID found in that list response
    const resourceIds: Record<string, string | number> = {};

    test.beforeAll(async () => {
      test.skip(!hasCredentials, 'TEST_USER_USERNAME / TEST_USER_PASSWORD not set');
      token = await getAuthToken();

      // Pre-fetch every list endpoint to collect real IDs for param-path tests
      await Promise.allSettled(
        simplePaths.map(async (path) => {
          try {
            const { status, body } = await apiGet(path, token);
            if (status >= 200 && status < 300) {
              const id = extractId(body);
              if (id !== null) resourceIds[path] = id;
            }
          } catch { /* ignore — individual endpoint may be unavailable */ }
        }),
      );
    });

    // ── GET list / collection endpoints ──────────────────────────────────────
    test.describe('GET collection endpoints', () => {
      for (const path of simplePaths) {
        test(path, async () => {
          if (SKIP_PATHS.has(path)) {
            console.log(`Skipping ${path} (in SKIP_PATHS)`);
            return;
          }

          const { status, body } = await apiGet(path, token);

          expect(status, `${path} returned server error`).toBeLessThan(500);

          if (status >= 200 && status < 300) {
            const schema = getResponseSchema(spec, path);
            if (schema) {
              const errors = validateSchema(body, schema, spec);
              expect(errors, `Schema mismatch on GET ${path}:\n${errors.join('\n')}`).toHaveLength(0);
            }
          }
        });
      }
    });

    // ── GET resource / detail endpoints (uses real IDs from list calls) ──────
    test.describe('GET resource endpoints', () => {
      for (const path of paramPaths) {
        test(path, async () => {
          if (SKIP_PATHS.has(path)) {
            console.log(`Skipping ${path} (in SKIP_PATHS)`);
            return;
          }

          const listPath = findListPath(path, simplePaths);
          const id = listPath ? resourceIds[listPath] : null;

          if (!id) {
            console.log(`Skipping ${path}: no real ID available from list`);
            return;
          }

          const filledPath = fillPathParams(path, id);
          const { status, body } = await apiGet(filledPath, token);

          expect(status, `${filledPath} returned server error`).toBeLessThan(500);

          if (status >= 200 && status < 300) {
            const schema = getResponseSchema(spec, path);
            if (schema) {
              const errors = validateSchema(body, schema, spec);
              expect(errors, `Schema mismatch on GET ${filledPath}:\n${errors.join('\n')}`).toHaveLength(0);
            }
          }
        });
      }
    });

  });
}
