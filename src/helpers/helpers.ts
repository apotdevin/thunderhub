import base64url from "base64url";
import { authenticatedLndGrpc } from "ln-service";

export const getIp = (req: any) => {
  if (!req || !req.headers) {
    return "";
  }
  const forwarded = req.headers["x-forwarded-for"];
  const before = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
  const ip = process.env.NODE_ENV === "development" ? "1.2.3.4" : before;
  return ip;
};

export const getBase64CertfromDerFormat = (url: string) => {
  if (!url) return null;

  const base64 = base64url.toBase64(url);

  const prefix = "-----BEGIN CERTIFICATE-----\n";
  const postfix = "-----END CERTIFICATE-----";
  const pem = base64.match(/.{0,64}/g) || [];
  const pemString = pem.join("\n");
  const pemComplete = prefix + pemString + postfix;
  const pemText = base64url.encode(pemComplete);

  return pemText;
};

export const getAuthLnd = (auth: string) => {
  const url = new URL(auth);

  const encodedCert = url.searchParams.get("cert") || "";
  const encodedMacaroon = url.searchParams.get("macaroon") || "";
  const socket = url.host;

  const cert = getBase64CertfromDerFormat(encodedCert);
  const macaroon = base64url.toBase64(encodedMacaroon);

  const { lnd } = authenticatedLndGrpc({
    cert,
    macaroon,
    socket
  });

  return lnd;
};
