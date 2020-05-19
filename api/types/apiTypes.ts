type SSOType = {
  macaroon: string | null;
  cert: string | null;
  host: string | null;
};

type VerifiedAccountType = {
  id: string;
} & SSOType;

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
  account: VerifiedAccountType | null;
  sso: SSOType;
  accounts: AccountType[];
};
