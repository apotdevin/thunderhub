export const buildAuthString = (
	name: string,
	host: string,
	admin: string,
	read: string,
	cert: string = ""
) => {
	const certString = cert !== "" ? `&cert=${cert}` : "";
	return `https://${host}?name=${name}&admin=${admin}&read=${read}${certString}`;
};

export const getAuthString = (
	host: string,
	macaroon: string,
	cert: string = ""
) => {
	const certString = cert !== "" ? `&cert=${cert}` : "";
	return `https://${host}?macaroon=${macaroon}${certString}`;
};

export const getAuthParams = (
	auth: string | null
): {
	name: string;
	host: string;
	admin: string;
	read: string;
	cert: string;
} => {
	if (!auth) {
		return { name: "", cert: "", admin: "", read: "", host: "" };
	}

	const url = new URL(auth);

	const name = url.searchParams.get("name") || "";
	const cert = url.searchParams.get("cert") || "";
	const admin = url.searchParams.get("admin") || "";
	const read = url.searchParams.get("read") || "";
	const host = url.host;

	return {
		name,
		cert,
		admin,
		read,
		host
	};
};

export const getAuthLnd = (lndconnect: string) => {
	const auth = lndconnect.replace("lndconnect", "https");
	const url = new URL(auth);

	const cert = url.searchParams.get("cert") || "";
	const macaroon = url.searchParams.get("macaroon") || "";
	const socket = url.host;

	return { cert, macaroon, socket };
};
