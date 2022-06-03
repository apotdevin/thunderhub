import React, { useState, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { SwapsCard } from '../src/views/peerswap/SwapsCard';
import { CreateSwapCard } from '../src/views/peerswap/CreateSwapCard';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { mediaWidths } from '../src/styles/Themes';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { X, ArrowLeft, ArrowRight } from 'react-feather';
import styled from 'styled-components';
import { PeerSwapSettings } from '../src/views/peerswap/Settings';
import { format } from 'date-fns';
import {
  Card,
  CardWithTitle,
  SubTitle,
  DarkSubTitle,
} from '../src/components/generic/Styled';
import { getErrorContent } from '../src/utils/error';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';
import { useGetPeerSwapSwapsQuery } from '../src/graphql/queries/__generated__/getPeerSwapSwaps.generated';

const S = {
  row: styled.div`
    width: 100%;
    display: grid;
    column-gap: 16px;
    grid-template-columns: 1fr 110px 50px;
    margin-bottom: 8px;
    align-items: center;
  `,

  grid: styled.div`
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 1fr;
    margin: 12px 0px;

    @media (${mediaWidths.mobile}) {
      grid-template-columns: 1fr 1fr;
    }
  `,
};

const PeerSwapView = () => {
  const [state, setState] = useState<string>('none');
  const [indexOpen, setIndexOpen] = useState(0);

  const [open] = useState<boolean>(false);

  // const [settings] = useLocalStorage('peerswapSettings', defaultSettings);
  const swapsQuery = useGetPeerSwapSwapsQuery({
    notifyOnNetworkStatusChange: true,
    onError: error => toast.error(getErrorContent(error)),
  });

  const SECTION_COLOR = '#FFD300';

  const beforeDate = useMemo(() => {
    const swaps = swapsQuery.data?.getPeerSwapSwaps.swaps || [];
    const lastSwap = swaps[0]?.createdAt
      ? new Date(swaps[0]?.createdAt)
      : new Date();

    return `${format(lastSwap, 'dd/MM/yy')} -> Today`;
  }, [swapsQuery.data]);

  const renderCreateSwap = () => {
    switch (state) {
      case 'swap_in':
        return (
          <CreateSwapCard setOpen={() => setState('none')} swapType="swap_in" />
        );
      case 'swap_out':
        return (
          <CreateSwapCard
            setOpen={() => setState('none')}
            swapType="swap_out"
          />
        );
      default:
        return null;
    }
  };

  const renderSwaps = useCallback(() => {
    const list = swapsQuery.data?.getPeerSwapSwaps.swaps || [];
    if (!list.length) {
      return null;
    }

    return (
      <>
        {[...list].reverse().map((i, index) => (
          <SwapsCard
            swap={i as any}
            key={index}
            index={index + 1}
            setIndexOpen={setIndexOpen}
            indexOpen={indexOpen}
          />
        ))}
      </>
    );
  }, [swapsQuery.data, indexOpen]);

  return (
    <>
      <CardWithTitle>
        <SubTitle>PeerSwap</SubTitle>
        <Card>
          <S.grid>
            <ColorButton
              withBorder={state === 'swap_in'}
              onClick={() => setState(state === 'swap_in' ? 'none' : 'swap_in')}
              fullWidth={true}
            >
              {state === 'swap_in' ? (
                <X size={18} color={SECTION_COLOR} />
              ) : (
                <ArrowRight size={18} color={SECTION_COLOR} />
              )}
              Swap In
            </ColorButton>
            <ColorButton
              withBorder={state === 'swap_out'}
              onClick={() =>
                setState(state === 'swap_out' ? 'none' : 'swap_out')
              }
              fullWidth={true}
            >
              {state === 'swap_out' ? (
                <X size={18} color={SECTION_COLOR} />
              ) : (
                <ArrowLeft size={18} color={SECTION_COLOR} />
              )}
              Swap Out
            </ColorButton>
          </S.grid>
          {renderCreateSwap()}
        </Card>
      </CardWithTitle>
      <CardWithTitle>
        <S.row>
          <SubTitle>
            Swaps
            <DarkSubTitle fontSize={'12px'}>{beforeDate}</DarkSubTitle>
          </SubTitle>
          {/* <ColorButton
            onClick={() => {
              setOpen(p => !p);
            }}
          >
            <Settings size={18} />
          </ColorButton> */}
        </S.row>
        {open && (
          <Card>
            <PeerSwapSettings />
          </Card>
        )}
        <Card bottom={'8px'} mobileCardPadding={'0'} mobileNoBackground={true}>
          {renderSwaps()}
        </Card>
      </CardWithTitle>
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <PeerSwapView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
