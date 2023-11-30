import React from 'react';
import styled from 'styled-components';
import { Zap, Link } from 'react-feather';
import { useNodeBalances } from '../../../hooks/UseNodeBalances';
import Big from 'big.js';
import { renderLine } from '../../../components/generic/helpers';
import {
  Card,
  CardWithTitle,
  SubTitle,
  Separation,
  // DarkSubTitle,
  // ResponsiveLine,
  LeftAlign,
} from '../../../components/generic/Styled';
import { Price } from '../../../components/price/Price';
import { mediaWidths } from '../../../styles/Themes';
import { FedimintGatewayCard } from './gateway/FedimintGatewayCard';
// import { useGatewayEcashTotal } from '../../../hooks/UseGatewayEcashTotal';
import { useGatewayState } from '../../../context/GatewayContext';
import { GatewayInfo } from '../../../api/types';
import { getNetworkIndicator } from './network';

const S = {
  grid: styled.div<{ gatewayInfo?: GatewayInfo | null }>`
    display: grid;
    grid-gap: 16px;
    grid-template-columns: ${({ gatewayInfo }) =>
      gatewayInfo ? '1fr 1fr 1fr' : '1fr 1fr'};

    @media (${mediaWidths.mobile}) {
      display: block;
    }
  `,
};

// const Tile = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   align-items: ${({ startTile }: { startTile?: boolean }) =>
//     startTile ? 'flex-start' : 'flex-end'};

//   @media (${mediaWidths.mobile}) {
//     width: 100%;
//     flex-direction: row;
//     align-items: flex-end;
//     margin: 0 0 8px;
//   }
// `;

const sectionColor = '#FFD300';

export const AccountInfo = () => {
  const { onchain, lightning } = useNodeBalances();
  const { gatewayInfo } = useGatewayState();
  // const totalFedimintEcash = useGatewayEcashTotal();

  // const totalAmount = new Big(onchain.confirmed)
  //   .add(onchain.pending)
  //   .add(onchain.closing)
  //   .add(lightning.confirmed)
  //   .add(lightning.pending)
  //   .add(totalFedimintEcash)
  //   .toString();

  // const totalChain = new Big(onchain.confirmed).add(onchain.pending).toString();
  // const totalLightning = new Big(lightning.confirmed)
  //   .add(lightning.pending)
  //   .toString();

  const activeLightning = new Big(lightning.active)
    .sub(lightning.commit)
    .toString();

  const inactiveLightning = new Big(lightning.confirmed)
    .sub(lightning.active)
    .add(lightning.commit)
    .toString();

  const chainPending = Number(onchain.pending) + Number(onchain.closing);
  const channelPending = Number(lightning.pending);

  return (
    <>
      <CardWithTitle>
        <SubTitle>
          Network: {getNetworkIndicator(gatewayInfo?.network || 'bitcoin')}
        </SubTitle>
        {/* <Card>
          <ResponsiveLine>
            <Tile>
              <DarkSubTitle>Total</DarkSubTitle>
              <div>
                <Price amount={totalAmount} />
              </div>
            </Tile>
            <Tile>
              <DarkSubTitle>Lightning</DarkSubTitle>
              <div>
                <Price amount={totalLightning} />
              </div>
            </Tile>
            <Tile>
              <DarkSubTitle>Onchain Bitcoin</DarkSubTitle>
              <div>
                <Price amount={totalChain} />
              </div>
            </Tile>
            {gatewayInfo && (
              <Tile>
                <DarkSubTitle>Fedimint Ecash</DarkSubTitle>
                <div>
                  <Price amount={totalFedimintEcash} />
                </div>
              </Tile>
            )}
          </ResponsiveLine>
        </Card> */}
      </CardWithTitle>
      <S.grid gatewayInfo={gatewayInfo}>
        <CardWithTitle>
          <Card>
            <LeftAlign>
              <Zap
                size={18}
                color={channelPending === 0 ? sectionColor : '#652EC7'}
              />
              <SubTitle>Lightning</SubTitle>
            </LeftAlign>
            <Separation />
            {renderLine('Available', <Price amount={activeLightning} />)}
            {renderLine('Not Available', <Price amount={inactiveLightning} />)}
            {renderLine('Pending', <Price amount={lightning.pending} />)}
          </Card>
        </CardWithTitle>
        <CardWithTitle>
          <Card>
            <LeftAlign>
              <Link
                size={18}
                color={chainPending === 0 ? sectionColor : '#652EC7'}
              />
              <SubTitle>Bitcoin</SubTitle>
            </LeftAlign>
            <Separation />
            {renderLine('Available', <Price amount={onchain.confirmed} />)}
            {renderLine('Pending', <Price amount={onchain.pending} />)}
            {renderLine('Force Closures', <Price amount={onchain.closing} />)}
          </Card>
        </CardWithTitle>
        {gatewayInfo ? <FedimintGatewayCard gatewayInfo={gatewayInfo} /> : null}
      </S.grid>
    </>
  );
};
