import { Field, ObjectType } from '@nestjs/graphql';
import type { Principal } from '../principal/principal.types';

export type JwtObjectType = {
  iat: number;
  exp: number;
  iss: string;
  sub: string;
};

export enum AuthType {
  /** One YAML account opened with its password. */
  YAML = 'yaml',
  /** A user from the YAML `users` list. */
  YAML_USER = 'yaml-user',
  /** A database user. */
  USER = 'user',
}

export const AUTH_PREFIX = {
  [AuthType.YAML]: 'yaml:',
  [AuthType.YAML_USER]: 'yaml-user:',
  [AuthType.USER]: 'user:',
} as const;

export function parseSubject(sub: string): Principal {
  if (sub.startsWith(AUTH_PREFIX[AuthType.USER])) {
    return {
      type: AuthType.USER,
      id: sub.slice(AUTH_PREFIX[AuthType.USER].length),
    };
  }

  if (sub.startsWith(AUTH_PREFIX[AuthType.YAML_USER])) {
    return {
      type: AuthType.YAML_USER,
      id: sub.slice(AUTH_PREFIX[AuthType.YAML_USER].length),
    };
  }

  if (sub.startsWith(AUTH_PREFIX[AuthType.YAML])) {
    return {
      type: AuthType.YAML,
      id: sub.slice(AUTH_PREFIX[AuthType.YAML].length),
    };
  }

  // Legacy tokens without prefix are treated as YAML accounts
  return { type: AuthType.YAML, id: sub };
}

export function toSubject(principal: Principal): string {
  return `${AUTH_PREFIX[principal.type]}${principal.id}`;
}

/**
 * The request user handed to resolvers via `@CurrentUser()`.
 *
 * `id` is the node hash once `NodeSlugGuard` has resolved the `x-node-slug`
 * header; before that it equals `principal.id`. Resolvers that talk to a node
 * use `id`; resolvers that need the person use `principal`.
 */
@ObjectType()
export class UserId {
  @Field()
  id: string;

  principal: Principal;
}
