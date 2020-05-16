type SSOType = {
  macaroon: string | null;
  cert: string | null;
  host: string | null;
};

type AccountType = {
  name: string;
  id: string;
  host: string;
  macaroon: string;
  cert: string | null;
};

export type ContextType = {
  ip: string;
  secret: string;
  ssoVerified: boolean;
  accountPassword: string;
  sso: SSOType;
  accounts: AccountType[];
};
