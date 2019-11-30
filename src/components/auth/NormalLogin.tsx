import React, { useState, useContext } from "react";
import { Input, SingleLine, Sub4Title, SimpleButton } from "../generic/Styled";
import { AccountContext } from "../../context/AccountContext";
import { buildAuthString } from "../../utils/auth";
import CryptoJS from "crypto-js";
import base64url from "base64url";

export const LoginForm = ({ available }: { available?: number }) => {
	const { setAccount } = useContext(AccountContext);

	const [isName, setName] = useState("");
	const [isHost, setHost] = useState("");
	const [isAdmin, setAdmin] = useState("");
	const [isRead, setRead] = useState("");
	const [isCert, setCert] = useState("");

	const admin = base64url.fromBase64(isAdmin);
	const read = base64url.fromBase64(isRead);
	const cert = base64url.fromBase64(isCert);

	const testPassword = "Test Password!";

	const canConnect =
		isName !== "" &&
		isHost !== "" &&
		isAdmin !== "" &&
		isRead !== "" &&
		!!available;

	const handleConnect = () => {
		const encryptedAdmin = CryptoJS.AES.encrypt(
			admin,
			testPassword
		).toString();

		const authString = buildAuthString(
			isName,
			isHost,
			encryptedAdmin,
			read,
			cert
		);

		localStorage.setItem(`auth${available}`, authString);

		setAccount({
			loggedIn: true,
			host: isHost,
			admin: encryptedAdmin,
			read,
			cert
		});
	};

	return (
		<>
			<SingleLine>
				<Sub4Title>Name:</Sub4Title>
				<Input onChange={e => setName(e.target.value)} />
			</SingleLine>
			<SingleLine>
				<Sub4Title>Host:</Sub4Title>
				<Input onChange={e => setHost(e.target.value)} />
			</SingleLine>
			<SingleLine>
				<Sub4Title>Admin:</Sub4Title>
				<Input onChange={e => setAdmin(e.target.value)} />
			</SingleLine>
			<SingleLine>
				<Sub4Title>Readonly:</Sub4Title>
				<Input onChange={e => setRead(e.target.value)} />
			</SingleLine>
			<SingleLine>
				<Sub4Title>Certificate:</Sub4Title>
				<Input onChange={e => setCert(e.target.value)} />
			</SingleLine>
			<SimpleButton
				disabled={!canConnect}
				enabled={canConnect}
				onClick={handleConnect}
			>
				Connect
			</SimpleButton>
		</>
	);
};
