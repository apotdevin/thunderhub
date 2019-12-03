import React, { useContext } from 'react';
import { DarkSubTitle } from '../../generic/Styled';
import { useQuery } from '@apollo/react-hooks';
import { GET_IN_OUT } from '../../../graphql/query';
import numeral from 'numeral';
import { SettingsContext } from '../../../context/SettingsContext';
import { getValue } from '../../../helpers/Helpers';
import { AccountContext } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import {
    VictoryBar,
    VictoryChart,
    VictoryAxis,
    VictoryVoronoiContainer,
    VictoryGroup,
} from 'victory';
import {
    chartAxisColor,
    chartGridColor,
    flowBarColor,
    flowBarColor2,
} from '../../../styles/Themes';
import { ChannelRow, CardContent } from '.';

interface Props {
    isTime: string;
    isType: string;
}

const getValueString = (amount: number): string => {
    if (amount >= 100000) {
        return `${amount / 1000000}m`;
    } else if (amount >= 1000) {
        return `${amount / 1000}k`;
    }
    return `${amount}`;
};

export const FlowReport = ({ isTime, isType }: Props) => {
    const { theme, price, symbol, currency } = useContext(SettingsContext);

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const { data, loading, error } = useQuery(GET_IN_OUT, {
        variables: { time: isTime, auth },
    });

    const priceProps = { price, symbol, currency };
    const getFormat = (amount: number) =>
        getValue({
            amount,
            ...priceProps,
        });

    if (!data || loading) {
        return <div>Loading</div>;
    }

    let domain = 24;
    let barWidth = 10;
    if (isTime === 'week') {
        domain = 7;
        barWidth = 15;
    } else if (isTime === 'month') {
        domain = 30;
        barWidth = 3;
    }

    const parsedData: {}[] = JSON.parse(data.getInOut.invoices);
    const parsedData2: {}[] = JSON.parse(data.getInOut.payments);

    // console.log(parsedData);
    // console.log(chartAxisColor[theme]);

    const getLabelString = (value: number) => {
        if (isType === 'amount') {
            return numeral(value).format('0,0');
        }
        return getFormat(value);
    };

    const total = getLabelString(
        parsedData
            .map((x: any) => x[isType])
            .reduce((a: number, c: number) => a + c, 0),
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
                            tickFormat={() => ''}
                            style={{
                                axis: { stroke: chartGridColor[theme] },
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            style={{
                                tickLabels: {
                                    fill: chartAxisColor[theme],
                                    fontSize: 18,
                                },
                                grid: { stroke: chartGridColor[theme] },
                                axis: { stroke: 'transparent' },
                            }}
                            tickFormat={a =>
                                isType === 'tokens' ? getValueString(a) : a
                            }
                        />
                        <VictoryGroup offset={barWidth}>
                            <VictoryBar
                                data={parsedData}
                                x="period"
                                y={isType}
                                style={{
                                    data: {
                                        fill: flowBarColor[theme],
                                        width: barWidth,
                                    },
                                }}
                            />
                            <VictoryBar
                                data={parsedData2}
                                x="period"
                                y={isType}
                                style={{
                                    data: {
                                        fill: flowBarColor2[theme],
                                        width: barWidth,
                                    },
                                }}
                            />
                        </VictoryGroup>
                    </VictoryChart>
                </div>
                <ChannelRow>
                    <DarkSubTitle>Total:</DarkSubTitle>
                    {total}
                </ChannelRow>
            </>
        );
    };

    return <CardContent>{renderContent()}</CardContent>;
};
