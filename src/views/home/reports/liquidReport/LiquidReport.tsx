import React from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
} from '../../../../components/generic/Styled';
import { useQuery } from '@apollo/react-hooks';
import { GET_LIQUID_REPORT } from '../../../../graphql/query';
import { useAccount } from '../../../../context/AccountContext';
import { getAuthString } from '../../../../utils/auth';
import {
    VictoryChart,
    VictoryAxis,
    VictoryBar,
    VictoryVoronoiContainer,
    VictoryTooltip,
} from 'victory';
import { useSettings } from '../../../../context/SettingsContext';
import { getValue } from '../../../../helpers/Helpers';
import {
    chartGridColor,
    chartAxisColor,
    liquidityBarColor,
} from '../../../../styles/Themes';
import { LoadingCard } from '../../../../components/loading/LoadingCard';

export const LiquidReport = () => {
    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

    const { theme, price, symbol, currency } = useSettings();

    const priceProps = { price, symbol, currency };
    const getFormat = (amount: number) =>
        getValue({
            amount,
            ...priceProps,
        });

    const { data, loading } = useQuery(GET_LIQUID_REPORT, {
        variables: { auth },
    });

    if (!data || !data.getChannelReport || loading) {
        return <LoadingCard title={'Liquidity Report'} />;
    }

    const { local, remote, maxIn, maxOut } = data.getChannelReport;
    const liquidity = [
        { x: 'Max Outgoing', y: maxOut },
        { x: 'Max Incoming', y: maxIn },
        { x: 'Local Balance', y: local },
        { x: 'Remote Balance', y: remote },
    ];

    return (
        <CardWithTitle>
            <SubTitle>Liquidity Report</SubTitle>
            <Card>
                <VictoryChart
                    height={100}
                    domainPadding={10}
                    padding={{
                        top: 10,
                        left: 100,
                        right: 50,
                        bottom: 20,
                    }}
                    containerComponent={
                        <VictoryVoronoiContainer
                            voronoiDimension="x"
                            labels={({ datum }) => getFormat(datum.y)}
                            labelComponent={
                                <VictoryTooltip orientation={'left'} />
                            }
                        />
                    }
                >
                    <VictoryAxis
                        style={{
                            axis: { stroke: chartGridColor[theme] },
                            tickLabels: {
                                fill: chartAxisColor[theme],
                                fontSize: 8,
                            },
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        style={{
                            tickLabels: {
                                fill: chartAxisColor[theme],
                                fontSize: 8,
                            },
                            grid: { stroke: chartGridColor[theme] },
                            axis: { stroke: 'transparent' },
                        }}
                        tickFormat={a => getFormat(a)}
                    />
                    <VictoryBar
                        horizontal
                        data={liquidity}
                        style={{
                            data: {
                                fill: liquidityBarColor[theme],
                                width: 10,
                            },
                            labels: {
                                fontSize: 8,
                            },
                        }}
                    />
                </VictoryChart>
            </Card>
        </CardWithTitle>
    );
};
