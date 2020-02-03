import base64url from 'base64url';
import { getAvailable } from './storage';

interface BuildProps {
    available: number;
    name?: string;
    host: string;
    admin?: string;
    read?: string;
    cert?: string;
}

export const deleteAuth = (index: number) => {
    localStorage.removeItem(`auth${index}-host`);
    localStorage.removeItem(`auth${index}-name`);
    localStorage.removeItem(`auth${index}-admin`);
    localStorage.removeItem(`auth${index}-read`);
    localStorage.removeItem(`auth${index}-cert`);
    sessionStorage.removeItem('session');

    localStorage.setItem('account', `auth${getAvailable()}`);
};

export const saveUserAuth = ({
    available,
    name,
    host,
    admin,
    read,
    cert,
}: BuildProps) => {
    localStorage.setItem('account', `auth${available}`);
    localStorage.setItem(`auth${available}-host`, host);
    localStorage.setItem(`auth${available}-name`, name ? name : 'no name');
    admin && localStorage.setItem(`auth${available}-admin`, admin);
    read && localStorage.setItem(`auth${available}-read`, read);
    cert && localStorage.setItem(`auth${available}-cert`, cert);
};

export const saveSessionAuth = (sessionAdmin: string) =>
    sessionStorage.setItem('session', sessionAdmin);

export const getAuthString = (
    host: string,
    macaroon: string,
    cert: string = '',
) => ({
    host,
    macaroon,
    cert,
});

export const getAuthParams = (available: string) => {
    const host = localStorage.getItem(`${available}-host`) || '';
    const name = localStorage.getItem(`${available}-name`) || '';
    const admin = localStorage.getItem(`${available}-admin`) || '';
    const read = localStorage.getItem(`${available}-read`) || '';
    const cert = localStorage.getItem(`${available}-cert`) || '';

    return {
        host,
        name,
        admin,
        read,
        cert,
    };
};

export const getAuthLnd = (lndconnect: string) => {
    const auth = lndconnect.replace('lndconnect', 'https');
    const url = new URL(auth);

    const cert = url.searchParams.get('cert') || '';
    const macaroon = url.searchParams.get('macaroon') || '';
    const socket = url.host;

    return { cert, macaroon, socket };
};

export const getBase64CertfromDerFormat = (url: string) => {
    if (!url) return null;

    const base64 = base64url.toBase64(url);

    const prefix = '-----BEGIN CERTIFICATE-----\n';
    const postfix = '-----END CERTIFICATE-----';
    const pem = base64.match(/.{0,64}/g) || [];
    const pemString = pem.join('\n');
    const pemComplete = prefix + pemString + postfix;
    const pemText = base64url.encode(pemComplete);

    return pemText;
};

const emptyObject = {
    cert: undefined,
    macaroon: undefined,
    readMacaroon: undefined,
    host: undefined,
};

export const getConfigLnd = (json: string) => {
    const parsedJson = JSON.parse(json);

    const config = parsedJson.configurations;

    if (config && config.length >= 1) {
        const cert = config[0].certificateThumbprint || '';
        const macaroon = config[0].adminMacaroon;
        const readMacaroon = config[0].readonlyMacaroon;
        const host = config[0].host;
        const port = config[0].port;

        return {
            cert,
            macaroon,
            readMacaroon,
            host: `${host}:${port}`,
        };
    }

    return emptyObject;
};
