import React, { useState, useContext } from "react";
import {
	Card,
	ChartLink,
	ChartRow,
	TitleRow,
	SubTitle,
	CardContent,
	Sub4Title,
	ChannelRow,
	CardWithTitle
} from "../generic/Styled";
import { useQuery } from "@apollo/react-hooks";
import { GET_FORWARD_REPORT } from "../../graphql/query";
import {
	VictoryBar,
	VictoryChart,
	VictoryAxis,
	VictoryVoronoiContainer
} from "victory";
import numeral from "numeral";
import { ButtonRow } from "./Buttons";
import { SettingsContext } from "../../context/SettingsContext";
import { chartAxisColor, chartBarColor } from "../../styles/Themes";
import { getValue } from "../../helpers/Helpers";
import { AccountContext } from "../../context/AccountContext";
import { getAuthString } from "../../utils/auth";

const getValueString = (amount: number): string => {
	if (amount >= 100000) {
		return `${amount / 1000000}m`;
	} else if (amount >= 1000) {
		return `${amount / 1000}k`;
	}
	return `${amount}`;
};

export const ForwardReport = () => {
	const { theme, price, symbol, currency } = useContext(SettingsContext);
	const [isTime, setIsTime] = useState<string>("week");
	const [isType, setIsType] = useState<string>("amount");

	const { host, read, cert } = useContext(AccountContext);
	const auth = getAuthString(host, read, cert);

	const { data, loading, error } = useQuery(GET_FORWARD_REPORT, {
		variables: { time: isTime, auth }
	});

	const priceProps = { price, symbol, currency };
	const getFormat = (amount: number) =>
		getValue({
			amount,
			...priceProps
		});

	if (!data || loading) {
		return <div>Loading</div>;
	}

	let domain = 24;
	let barWidth = 10;
	if (isTime === "week") {
		domain = 7;
		barWidth = 15;
	} else if (isTime === "month") {
		domain = 30;
		barWidth = 5;
	}

	const parsedData: {}[] = JSON.parse(data.getForwardReport);

	// console.log(parsedData);
	// console.log(chartAxisColor[theme]);

	const getLabelString = (value: number) => {
		if (isType === "amount") {
			return numeral(value).format("0,0");
		}
		return getFormat(value);
	};

	const total = getLabelString(
		parsedData
			.map((x: any) => x[isType])
			.reduce((a: number, c: number) => a + c, 0)
	);

	const renderContent = () => {
		if (parsedData.length <= 0) {
			return <p>Your node has not forwarded any payments.</p>;
		}
		return (
			<>
				<div>
					<VictoryChart
						domainPadding={50}
						padding={{ top: 10, left: 50, right: 50, bottom: 20 }}
						containerComponent={
							<VictoryVoronoiContainer
								voronoiDimension="x"
								labels={({ datum }) =>
									getLabelString(datum[isType])
								}
							/>
						}
					>
						<VictoryAxis
							domain={[0, domain]}
							tickFormat={() => ""}
							style={{
								axis: { stroke: chartAxisColor[theme] }
							}}
						/>
						<VictoryAxis
							dependentAxis
							style={{
								tickLabels: {
									fill: chartAxisColor[theme],
									fontSize: 18
								},
								grid: { stroke: chartAxisColor[theme] },
								axis: { stroke: "transparent" }
							}}
							tickFormat={a =>
								isType === "tokens" ? getValueString(a) : a
							}
						/>
						<VictoryBar
							data={parsedData}
							x="period"
							y={isType}
							style={{
								data: {
									fill: chartBarColor[theme],
									width: barWidth
								}
							}}
						/>
					</VictoryChart>
				</div>
				<ChannelRow>
					<Sub4Title>Total:</Sub4Title>
					{total}
				</ChannelRow>
				<div style={{ marginTop: "auto" }}>
					<ButtonRow
						isTime={isTime}
						isType={isType}
						setIsTime={setIsTime}
						setIsType={setIsType}
					/>
				</div>
			</>
		);
	};

	return (
		<CardWithTitle>
			<SubTitle>Fowards</SubTitle>
			<Card bottom={"10px"} full>
				<CardContent>{renderContent()}</CardContent>
			</Card>
		</CardWithTitle>
	);
};
