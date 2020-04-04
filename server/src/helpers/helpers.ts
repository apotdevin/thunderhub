import { authenticatedLndGrpc } from 'ln-service';
import { envConfig } from '../utils/envConfig';

export const getIp = (req: any) => {
    if (!req || !req.headers) {
        return '';
    }
    const forwarded = req.headers['x-forwarded-for'];
    const before = forwarded
        ? forwarded.split(/, /)[0]
        : req.connection.remoteAddress;
    const ip = envConfig.env === 'development' ? '1.2.3.4' : before;
    return ip;
};

export const getAuthLnd = (auth: {
    cert: string;
    macaroon: string;
    host: string;
}) => {
    const encodedCert = auth.cert || '';
    const encodedMacaroon = auth.macaroon || '';
    const socket = auth.host || '';

    const cert = encodedCert;
    const macaroon = encodedMacaroon;

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

export const getErrorDetails = (error: any[]): string => {
    let details = '';
    if (error.length > 2) {
        if (error[2].err) {
            details = error[2].err.details;
        } else if (error[2].details) {
            details = error[2].details;
        }
    }

    return details;
};

export const getErrorMsg = (error: any[]): string => {
    const code = error[0];
    const msg = error[1];

    let details = getErrorDetails(error);

    return JSON.stringify({ code, msg, details });
};
