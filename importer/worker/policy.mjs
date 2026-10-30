import { normalizeRepository } from '../engine/github.mjs';

/** Owners are an explicit operator opt-in; exact repositories remain the default. */
export function repositoryPolicy(env = process.env) {
  const entries = name => (env[name] || '').split(',').map(s => s.trim()).filter(Boolean);
  const repositories = new Set(entries('KGHQ_ALLOWED_REPOSITORIES').map(s => normalizeRepository(s).toLowerCase()));
  const owners = new Set(entries('KGHQ_ALLOWED_OWNERS').map(s => {
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(s)) throw Error('Invalid allowlisted owner');
    return s.toLowerCase();
  }));
  if (!repositories.size && !owners.size) throw Error('Configure an explicit repository or opt-in owner allowlist');
  return repository => {
    const normalized = normalizeRepository(repository).toLowerCase();
    return repositories.has(normalized) || owners.has(normalized.split('/')[0]);
  };
}
