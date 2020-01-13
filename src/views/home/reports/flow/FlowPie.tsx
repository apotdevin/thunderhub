import React from 'react';
import { DarkSubTitle } from '../../../../components/generic/Styled';
import { useSettings } from '../../../../context/SettingsContext';
import { getValue } from '../../../../helpers/Helpers';
import { VictoryPie } from 'victory';
import { chartAxisColor } from '../../../../styles/Themes';
import { Row, Col, PieRow } from '../flow';

interface Props {
    flowPie: { x: string; y: number }[];
    isType: string;
}

export const FlowPie = ({ flowPie, isType }: Props) => {
    const { theme, price, symbol, currency } = useSettings();

    const priceProps = { price, symbol, currency };
    const getFormat = (amount: number) =>
        getValue({
            amount,
            ...priceProps,
        });

    return (
        <Row>
            <Col>
                <PieRow>
                    <DarkSubTitle>{flowPie[0].x}</DarkSubTitle>
                    {isType === 'tokens'
                        ? getFormat(flowPie[0].y)
                        : flowPie[0].y}
                </PieRow>
                <PieRow>
                    <DarkSubTitle>{flowPie[1].x}</DarkSubTitle>
                    {isType === 'tokens'
                        ? getFormat(flowPie[1].y)
                        : flowPie[1].y}
                </PieRow>
            </Col>
            <VictoryPie
                padding={0}
                height={150}
                colorScale={['#FD5F00', '#ffd300']}
                labels={() => ''}
                padAngle={3}
                innerRadius={50}
                labelRadius={55}
                data={flowPie}
                style={{
                    labels: { fontSize: 24, fill: chartAxisColor[theme] },
                }}
            />
        </Row>
    );
};
