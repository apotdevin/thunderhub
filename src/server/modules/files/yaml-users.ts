export type YamlUser = {
  id: string;
  name: string;
  /** Hashed password, when the user can sign in with one. */
  password?: string;
};

export type YamlUserInput =
  | string
  | { id?: string; name?: string; password?: string };

const MAX_IDENTIFIER_LENGTH = 254;

export function normalizeIdentifier(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;

  const id = value.trim().toLowerCase();
  if (!id || id.length > MAX_IDENTIFIER_LENGTH || /\s/.test(id)) {
    return undefined;
  }

  return id;
}

export function parseYamlUsers(raw: unknown): {
  users: YamlUser[];
  warnings: string[];
} {
  if (raw == null) return { users: [], warnings: [] };

  if (!Array.isArray(raw)) {
    return {
      users: [],
      warnings: ['YAML users must be a list. Ignoring it.'],
    };
  }

  const users: YamlUser[] = [];
  const seen = new Set<string>();
  const warnings: string[] = [];

  for (const entry of raw) {
    const id = normalizeIdentifier(
      typeof entry === 'string' ? entry : entry?.id
    );
    if (!id) {
      warnings.push('Skipping a YAML user with an invalid id.');
      continue;
    }

    if (seen.has(id)) {
      warnings.push(
        `YAML user "${id}" is listed more than once. Keeping the first.`
      );
      continue;
    }

    seen.add(id);
    const object = typeof entry === 'object' && entry ? entry : {};
    const name =
      typeof object.name === 'string' && object.name.trim()
        ? object.name.trim()
        : id;
    const password =
      typeof object.password === 'string' && object.password
        ? object.password
        : undefined;

    users.push(password ? { id, name, password } : { id, name });
  }

  return { users, warnings };
}

export function parseAccountUsers(
  raw: unknown,
  known: Set<string>,
  accountName: string
): { ids: string[]; warnings: string[] } {
  if (raw == null) return { ids: [], warnings: [] };

  if (!Array.isArray(raw)) {
    return {
      ids: [],
      warnings: [`Account ${accountName} users must be a list. Ignoring it.`],
    };
  }

  const ids: string[] = [];
  const warnings: string[] = [];

  for (const entry of raw) {
    const id = normalizeIdentifier(
      typeof entry === 'string' ? entry : entry?.id
    );
    if (!id || !known.has(id)) {
      warnings.push(
        `Account ${accountName} references an unknown user. Skipping it.`
      );
      continue;
    }

    if (!ids.includes(id)) ids.push(id);
  }

  return { ids, warnings };
}
