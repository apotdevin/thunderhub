import React, { useContext } from 'react';
import numeral from 'numeral';
import { SettingsContext } from '../../../context/SettingsContext';
import { getValue } from '../../../helpers/Helpers';
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

interface Props {
    isTime: string;
    isType: string;
    parsedData: {}[];
    parsedData2: {}[];
}

const getValueString = (amount: number): string => {
    if (amount >= 100000) {
        return `${amount / 1000000}m`;
    } else if (amount >= 1000) {
        return `${amount / 1000}k`;
    }
    return `${amount}`;
};

export const FlowReport = ({
    isTime,
    isType,
    parsedData,
    parsedData2,
}: Props) => {
    const { theme, price, symbol, currency } = useContext(SettingsContext);

    const priceProps = { price, symbol, currency };
    const getFormat = (amount: number) =>
        getValue({
            amount,
            ...priceProps,
        });

    let domain = 24;
    let barWidth = 3;
    if (isTime === 'week') {
        domain = 7;
        barWidth = 15;
    } else if (isTime === 'month') {
        domain = 30;
        barWidth = 3;
    }

    const getLabelString = (value: number) => {
        if (isType === 'amount') {
            return numeral(value).format('0,0');
        }
        return getFormat(value);
    };

    return (
        <VictoryChart
            height={100}
            domainPadding={50}
            padding={{ top: 10, left: 50, right: 50, bottom: 10 }}
            containerComponent={
                <VictoryVoronoiContainer
                    voronoiDimension="x"
                    labels={({ datum }) => getLabelString(datum[isType])}
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
                        fontSize: 8,
                    },
                    grid: { stroke: chartGridColor[theme] },
                    axis: { stroke: 'transparent' },
                }}
                tickFormat={a => (isType === 'tokens' ? getFormat(a) : a)}
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
                        labels: {
                            fontSize: '12px',
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
                        labels: {
                            fontSize: '12px',
                        },
                    }}
                />
            </VictoryGroup>
        </VictoryChart>
    );
};
