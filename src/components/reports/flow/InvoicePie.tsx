import React, { useContext } from 'react';
import { DarkSubTitle } from '../../generic/Styled';
import { SettingsContext } from '../../../context/SettingsContext';
import { VictoryPie } from 'victory';
import { chartAxisColor } from '../../../styles/Themes';
import { Row, Col, PieRow } from '.';

interface Props {
    invoicePie: { x: string; y: string }[];
}

export const InvoicePie = ({ invoicePie }: Props) => {
    const { theme } = useContext(SettingsContext);

    return (
        <Row>
            <Col>
                <PieRow>
                    <DarkSubTitle bottom={'0px'}>Confirmed:</DarkSubTitle>
                    {invoicePie[0].y}
                </PieRow>
                <PieRow>
                    <DarkSubTitle bottom={'0px'}>Unconfirmed:</DarkSubTitle>
                    {invoicePie[1].y}
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
                data={invoicePie}
                style={{
                    labels: { fontSize: 24, fill: chartAxisColor[theme] },
                }}
            />
        </Row>
    );
};
