import { parseAccountUsers, parseYamlUsers } from './yaml-users';

describe('parseYamlUsers', () => {
  it('accepts strings and objects, and lowercases ids', () => {
    const parsed = parseYamlUsers([
      'You@Example.com',
      { id: 'Guest', name: 'Guest user' },
    ]);

    expect(parsed.warnings).toEqual([]);
    expect(parsed.users).toEqual([
      { id: 'you@example.com', name: 'you@example.com' },
      { id: 'guest', name: 'Guest user' },
    ]);
  });

  it('keeps a password only when one is set', () => {
    const parsed = parseYamlUsers([
      { id: 'a', password: 'thunderhub-hash' },
      { id: 'b', password: '' },
      { id: 'c', password: 42 },
    ]);

    expect(parsed.users).toEqual([
      { id: 'a', name: 'a', password: 'thunderhub-hash' },
      { id: 'b', name: 'b' },
      { id: 'c', name: 'c' },
    ]);
  });

  it('keeps the first duplicate', () => {
    const parsed = parseYamlUsers(['a@example.com', 'A@Example.com']);

    expect(parsed.users).toEqual([
      { id: 'a@example.com', name: 'a@example.com' },
    ]);
    expect(parsed.warnings).toHaveLength(1);
  });
});

describe('parseAccountUsers', () => {
  const known = new Set(['you@example.com', 'guest']);

  it('keeps known users and drops the rest', () => {
    const parsed = parseAccountUsers(
      ['You@Example.com', 'missing', 'guest'],
      known,
      'Home'
    );

    expect(parsed.ids).toEqual(['you@example.com', 'guest']);
    expect(parsed.warnings).toHaveLength(1);
  });
});
