import base64url from 'base64url';
import { getAvailable } from './storage';

interface BuildProps {
    available: number;
    name?: string;
    host: string;
    admin?: string;
    viewOnly?: string;
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
    viewOnly,
    cert,
}: BuildProps) => {
    localStorage.setItem('account', `auth${available}`);
    localStorage.setItem(`auth${available}-host`, host);
    localStorage.setItem(`auth${available}-name`, name ? name : `${available}`);
    admin && localStorage.setItem(`auth${available}-admin`, admin);
    viewOnly && localStorage.setItem(`auth${available}-read`, viewOnly);
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
    const viewOnly = localStorage.getItem(`${available}-read`) || '';
    const cert = localStorage.getItem(`${available}-cert`) || '';

    return {
        host,
        name,
        admin,
        viewOnly,
        cert,
    };
};

export const getAuthLnd = (lndconnect: string) => {
    const auth = lndconnect.replace('lndconnect', 'https');

    let url;

    try {
        url = new URL(auth);
    } catch (error) {
        return {
            cert: '',
            macaroon: '',
            socket: '',
        };
    }

    const cert = url.searchParams.get('cert') || '';
    const macaroon = url.searchParams.get('macaroon') || '';
    const socket = url.host;

    return {
        cert: base64url.toBase64(cert),
        macaroon: base64url.toBase64(macaroon),
        socket,
    };
};

export const getBase64CertfromDerFormat = (base64: string) => {
    if (!base64) return null;

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
    admin: undefined,
    viewOnly: undefined,
    host: undefined,
};

export const getConfigLnd = (json: string) => {
    const parsedJson = JSON.parse(json);

    const config = parsedJson.configurations;

    if (config && config.length >= 1) {
        const cert = config[0].certificateThumbprint || '';
        const admin = config[0].adminMacaroon;
        const viewOnly = config[0].readonlyMacaroon;
        const host = config[0].host;
        const port = config[0].port;

        return {
            cert,
            admin,
            viewOnly,
            host: `${host}:${port}`,
        };
    }

    return emptyObject;
};

export const getQRConfig = (json: string) => {
    const config = JSON.parse(json);

    if (config) {
        const { name = '', cert = '', admin, viewOnly, host } = config;

        return {
            name,
            cert,
            admin,
            viewOnly,
            host,
        };
    }

    return { ...emptyObject, name: undefined };
};
