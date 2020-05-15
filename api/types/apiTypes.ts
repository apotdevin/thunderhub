type VerifiedUserType = { user: string };

type SSOType = {
  macaroon: string | null;
  cert: string | null;
  host: string | null;
};

export type ContextType = {
  ip: string;
  secret: string;
  verifiedUsers: VerifiedUserType[];
  sso: SSOType;
};
