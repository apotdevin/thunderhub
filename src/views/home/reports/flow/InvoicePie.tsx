import React from 'react';
import { DarkSubTitle } from '../../../../components/generic/Styled';
import { useConfigState } from '../../../../context/ConfigContext';
import { VictoryPie } from 'victory';
import { chartAxisColor } from '../../../../styles/Themes';
import { Row, Col, PieRow } from '.';

interface Props {
  invoicePie: { x: string; y: number }[];
}

export const InvoicePie = ({ invoicePie }: Props) => {
  const { theme } = useConfigState();

  return (
    <Row>
      <Col>
        <PieRow>
          <DarkSubTitle>Confirmed:</DarkSubTitle>
          {invoicePie[0].y}
        </PieRow>
        <PieRow>
          <DarkSubTitle>Unconfirmed:</DarkSubTitle>
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
