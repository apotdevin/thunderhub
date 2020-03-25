import base64url from 'base64url';
import { saveAccounts } from './storage';

interface BuildProps {
    name?: string;
    host: string;
    admin?: string;
    viewOnly?: string;
    cert?: string;
    accounts: any;
}

export const saveUserAuth = ({
    name = '',
    host,
    admin = '',
    viewOnly = '',
    cert = '',
    accounts,
}: BuildProps) => {
    const newAccount = {
        name,
        host,
        admin,
        viewOnly,
        cert,
    };

    const newAccounts = [...accounts, newAccount];
    saveAccounts(newAccounts);
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

export const getAuth = (account?: string) => {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const currentActive = Math.max(
        parseInt(account ?? (localStorage.getItem('active') || '0')),
        0,
    );
    const sessionAdmin = sessionStorage.getItem('session') || '';

    const accountsLength = accounts.length;

    const active =
        accountsLength > 0 && currentActive >= accountsLength
            ? 0
            : currentActive;

    const defaultAccount = {
        name: '',
        host: '',
        admin: '',
        viewOnly: '',
        cert: '',
    };

    const activeAccount =
        accountsLength > 0 && active < accountsLength
            ? accounts[active]
            : defaultAccount;

    const { name, host, admin, viewOnly, cert } = activeAccount;
    const loggedIn = host !== '' && (viewOnly !== '' || sessionAdmin !== '');

    return { name, host, admin, viewOnly, cert, accounts, loggedIn };
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
