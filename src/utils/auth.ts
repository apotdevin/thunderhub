import base64url from 'base64url';

export const buildAuthString = (
    name: string,
    host: string,
    admin: string,
    read: string,
    cert: string = '',
) => {
    const certString = cert !== '' ? `&cert=${cert}` : '';
    return `https://${host}?name=${name}&admin=${admin}&read=${read}${certString}`;
};

export const getAuthString = (
    host: string,
    macaroon: string,
    cert: string = '',
) => {
    const certString = cert !== '' ? `&cert=${cert}` : '';
    return `https://${host}?macaroon=${macaroon}${certString}`;
};

export const getAuthParams = (
    auth: string | null,
): {
    name: string;
    host: string;
    admin: string;
    read: string;
    cert: string;
} => {
    if (!auth) {
        return { name: '', cert: '', admin: '', read: '', host: '' };
    }

    const url = new URL(auth);

    const name = url.searchParams.get('name') || '';
    const cert = url.searchParams.get('cert') || '';
    const admin = url.searchParams.get('admin') || '';
    const read = url.searchParams.get('read') || '';
    const host = url.host;

    return {
        name,
        cert,
        admin,
        read,
        host,
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

    return {
        cert: '',
        macaroon: '',
        readMacaroon: '',
        host: '',
    };
};
