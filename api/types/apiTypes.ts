type SSOType = {
  macaroon: string | null;
  cert: string | null;
  host: string | null;
};

export type ContextType = {
  ip: string;
  secret: string;
  ssoVerified: boolean;
  accountVerified: string;
  sso: SSOType;
};
