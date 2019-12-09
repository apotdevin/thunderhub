import base64url from 'base64url';
import { authenticatedLndGrpc } from 'ln-service';

export const getIp = (req: any) => {
    if (!req || !req.headers) {
        return '';
    }
    const forwarded = req.headers['x-forwarded-for'];
    const before = forwarded
        ? forwarded.split(/, /)[0]
        : req.connection.remoteAddress;
    const ip = process.env.NODE_ENV === 'development' ? '1.2.3.4' : before;
    return ip;
};

export const getAuthLnd = (auth: string) => {
    const url = new URL(auth);

    const encodedCert = url.searchParams.get('cert') || '';
    const encodedMacaroon = url.searchParams.get('macaroon') || '';
    const socket = url.host;

    const cert = base64url.toBase64(encodedCert);
    const macaroon = base64url.toBase64(encodedMacaroon).replace('==', '');

    const params =
        encodedCert !== ''
            ? {
                  cert,
                  macaroon,
                  socket,
              }
            : { macaroon, socket };

    const { lnd } = authenticatedLndGrpc(params);

    return lnd;
};

export const getErrorMsg = (error: any[]): string => {
    const code = error[0];
    const msg = error[1];

    let details = '';
    if (error.length > 2) {
        if (error[2].err) {
            details = error[2].err.details;
        } else if (error[2].details) {
            details = error[2].details;
        }
    }

    return JSON.stringify({ code, msg, details });
};
