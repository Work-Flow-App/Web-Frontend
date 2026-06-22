import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAuthToken, apiGet } from './helpers/api';

// ─── OpenAPI types (minimal) ────────────────────────────────────────────────

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

// ─── Spec loading ────────────────────────────────────────────────────────────

const SPEC_PATH = join(process.cwd(), 'openapi-spec.json');

function loadSpec(): OpenApiSpec | null {
  if (!existsSync(SPEC_PATH)) return null;
  try {
    return JSON.parse(readFileSync(SPEC_PATH, 'utf-8')) as OpenApiSpec;
  } catch {
    return null;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function getResponseSchema(spec: OpenApiSpec, path: string): SchemaObject | null {
  const pathItem = spec.paths?.[path];
  if (!pathItem) return null;
  const get = pathItem.get as Record<string, unknown> | undefined;
  const responses = get?.responses as Record<string, unknown> | undefined;
  const ok = responses?.['200'] as Record<string, unknown> | undefined;
  const content = ok?.content as Record<string, unknown> | undefined;
  const appJson = content?.['application/json'] as Record<string, unknown> | undefined;
  return (appJson?.schema as SchemaObject) ?? null;
}

// Collect GET paths that have no path parameters (no `{...}` segments)
function getSimpleGetPaths(spec: OpenApiSpec): string[] {
  return Object.entries(spec.paths ?? {})
    .filter(([path, item]) => !path.includes('{') && !!(item as Record<string, unknown>).get)
    .map(([path]) => path)
    .slice(0, 20); // cap at 20 endpoints to keep CI fast
}

// ─── Tests ───────────────────────────────────────────────────────────────────

const spec = loadSpec();
const hasCredentials = !!(process.env.TEST_USER_USERNAME && process.env.TEST_USER_PASSWORD);

if (!spec) {
  test('OpenAPI spec not found — skipping contract tests', async () => {
    // openapi-spec.json is downloaded in CI via the workflow fetch step.
    // This test only runs in CI; locally the file is absent so we skip.
    console.log(`Spec not found at ${SPEC_PATH}. Run CI workflow or fetch it manually.`);
  });
} else {
  const paths = getSimpleGetPaths(spec);

  test.describe('API Contract Tests', () => {
    let token = '';

    test.beforeAll(async () => {
      if (!hasCredentials) return;
      token = await getAuthToken();
    });

    test('Authentication returns access token', async () => {
      if (!hasCredentials) {
        console.log('Skipping: TEST_USER_USERNAME / TEST_USER_PASSWORD not set');
        return;
      }
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    for (const path of paths) {
      test(`GET ${path} — status and schema`, async () => {
        if (!hasCredentials) {
          console.log(`Skipping ${path}: no test credentials`);
          return;
        }

        const { status, body } = await apiGet(path, token);

        // 5xx means the server is broken — always fail
        expect(status, `${path} returned server error`).toBeLessThan(500);

        // For successful responses, validate the response body matches the spec schema
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
}
