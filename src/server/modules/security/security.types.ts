import { Field, ObjectType } from '@nestjs/graphql';

export type JwtObjectType = {
  iat: number;
  exp: number;
  iss: string;
  sub: string;
};

export enum AuthType {
  YAML = 'yaml',
  USER = 'user',
}

export const AUTH_PREFIX = {
  [AuthType.YAML]: 'yaml:',
  [AuthType.USER]: 'user:',
} as const;

export function parseSubject(sub: string): { authType: AuthType; id: string } {
  if (sub.startsWith(AUTH_PREFIX[AuthType.USER])) {
    return {
      authType: AuthType.USER,
      id: sub.slice(AUTH_PREFIX[AuthType.USER].length),
    };
  }

  if (sub.startsWith(AUTH_PREFIX[AuthType.YAML])) {
    return {
      authType: AuthType.YAML,
      id: sub.slice(AUTH_PREFIX[AuthType.YAML].length),
    };
  }

  // Legacy tokens without prefix are treated as YAML accounts
  return { authType: AuthType.YAML, id: sub };
}

@ObjectType()
export class UserId {
  @Field()
  id: string;

  authType: AuthType = AuthType.YAML;

  /** Original DB user ID, preserved when NodeSlugGuard swaps id to node hash */
  userId?: string;
}
