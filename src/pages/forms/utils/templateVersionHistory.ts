import type { FormTemplateRequest } from '../../../services/api';

export interface TemplateVersionEntry {
  id: number;
  version: number;
  archived: boolean;
  fieldCount: number;
}

/**
 * Reconstructs the full version chain (oldest -> newest) for a template by walking
 * `parentTemplateId` links both backward (to the root version) and forward (to any newer
 * replacement), against the full template list. There's no dedicated version-history endpoint,
 * so this is derived client-side from the same `getAllTemplates()` list the app already fetches
 * (it includes archived rows - only the main list filters them out).
 */
export const buildTemplateVersionChain = (templates: FormTemplateRequest[], startId: number): TemplateVersionEntry[] => {
  const byId = new Map(templates.filter((t) => t.id != null).map((t) => [t.id as number, t]));

  const chain: FormTemplateRequest[] = [];
  const visited = new Set<number>();

  // Walk backward from the given version to the root.
  let current = byId.get(startId);
  while (current?.id != null && !visited.has(current.id)) {
    chain.unshift(current);
    visited.add(current.id);
    current = current.parentTemplateId != null ? byId.get(current.parentTemplateId) : undefined;
  }

  // Walk forward from the newest known version to any newer replacement.
  let lastId = chain[chain.length - 1]?.id;
  while (lastId != null) {
    const child = templates.find((t) => t.parentTemplateId === lastId && t.id != null && !visited.has(t.id));
    if (!child?.id) break;
    chain.push(child);
    visited.add(child.id);
    lastId = child.id;
  }

  return chain.map((t) => ({
    id: t.id as number,
    version: t.version ?? 1,
    archived: !!t.archived,
    fieldCount: t.fields?.length ?? 0,
  }));
};
