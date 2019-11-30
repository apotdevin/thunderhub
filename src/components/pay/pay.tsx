import React, { useState } from "react";
import {
	CardWithTitle,
	SubTitle,
	Card,
	Sub4Title,
	Input,
	SingleLine,
	SimpleButton
} from "../generic/Styled";
import { useMutation } from "@apollo/react-hooks";
import { PAY_INVOICE } from "../../graphql/mutation";
import { Send, Settings } from "../generic/Icons";

export const PayCard = () => {
	const [request, setRequest] = useState("");
	const [makePayment, { data, loading, error }] = useMutation(PAY_INVOICE);

	// console.log(data, loading, error);

	return (
		<CardWithTitle>
			<SubTitle>Send Sats</SubTitle>
			<Card bottom={"10px"}>
				<SingleLine>
					<Sub4Title>Request:</Sub4Title>
					<Input onChange={e => setRequest(e.target.value)} />
					<SimpleButton>
						<Settings />
					</SimpleButton>
					<SimpleButton
						enabled={request !== ""}
						onClick={() => {
							makePayment({ variables: { request } });
						}}
					>
						<Send />
						Send Sats
					</SimpleButton>
				</SingleLine>
			</Card>
		</CardWithTitle>
	);
};
