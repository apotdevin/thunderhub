import { AuthType } from '../security/security.types';

/**
 * The authenticated subject stored in the session cookie.
 *
 * - `AuthType.YAML`      one YAML account opened with its password (id = account hash)
 * - `AuthType.YAML_USER` a user from the `users` list in the YAML file (id = user id)
 * - `AuthType.USER`      a database user (id = users.id)
 */
export type Principal = {
  type: AuthType;
  id: string;
};

/** A node the principal may open. `hash` is the AccountsService key. */
export type PrincipalNode = {
  hash: string;
  slug: string;
  name: string;
  type?: string;
  network?: string;
};

/** What a principal is allowed to do. Cheap to compute, no I/O. */
export type PrincipalCapabilities = {
  /** Value the client receives as the account/session type. */
  kind: 'server' | 'sso' | 'yaml-user' | 'db';
  /** Add, edit and delete nodes from the UI. */
  canManageNodes: boolean;
  /** Enable or disable TOTP on the account. */
  canUseTwofa: boolean;
  /** Backed by a `users` row, so per-user data (channel notes) can be stored. */
  hasDatabaseUser: boolean;
};

export type PrincipalInfo = PrincipalCapabilities & {
  displayName: string;
  twofaEnabled: boolean;
};
