import { Fragment, useEffect, useState } from 'react';
import { RefreshCw, Trash } from 'react-feather';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { getTransactionLink } from '../../components/generic/helpers';
import {
  Card,
  DarkSubTitle,
  Separation,
  SingleLine,
  SubTitle,
} from '../../components/generic/Styled';
import Modal from '../../components/modal/ReactModal';
import { useGetBoltzSwapStatusQuery } from '../../graphql/queries/__generated__/getBoltzSwapStatus.generated';
import { chartColors, themeColors } from '../../styles/Themes';
import styled from 'styled-components';
import { SwapClaim } from './SwapClaim';
import { useSwapsDispatch, useSwapsState } from './SwapContext';
import { useSwapExpire } from './SwapExpire';
import { SwapQuote } from './SwapQuote';
import { EnrichedSwap } from './types';

const S = {
  row: styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
  `,
  single: styled.div`
    display: flex;
    align-items: center;
  `,
  expired: styled.div`
    border: 1px solid ${chartColors.orange};
    background-color: rgba(255, 193, 10, 0.1);
    padding: 4px 8px;
    border-radius: 8px;
  `,
  warning: styled.div`
    border: 1px solid ${chartColors.darkyellow};
    background-color: rgba(255, 193, 10, 0.1);
    padding: 4px 8px;
    border-radius: 8px;
  `,
  ready: styled.div`
    border: 1px solid ${chartColors.green};
    background-color: rgba(10, 255, 59, 0.05);
    padding: 4px 8px;
    border-radius: 8px;
  `,
  claiming: styled.div`
    border: 1px solid ${chartColors.green};
    background-color: rgba(10, 255, 59, 0.05);
    color: ${chartColors.green};
    padding: 4px 8px;
    border-radius: 8px;
  `,
  finished: styled.div`
    border: 1px solid ${themeColors.grey8};
    background-color: rgba(10, 255, 59, 0.05);
    padding: 4px 8px;
    border-radius: 8px;
  `,
};

const CREATED = 'swap.created';
export const MEMPOOL = 'transaction.mempool';
const CONFIRMED = 'transaction.confirmed';
const SETTLED = 'invoice.settled';
const EXPIRED = 'swap.expired';
const REFUNDED = 'transaction.refunded';

const SwapRow = ({ swap, index }: { swap: EnrichedSwap; index: number }) => {
  const dispatch = useSwapsDispatch();

  const ReadyComponent = () => {
    const time = useSwapExpire(swap.decodedInvoice?.expires_at);
    return (
      <S.row>
        <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
        <S.single>
          <S.ready>Ready to Pay {time}</S.ready>
          <ColorButton
            onClick={() => dispatch({ type: 'open', open: index })}
            arrow={true}
            withMargin={'0 0 0 4px'}
          >
            Pay
          </ColorButton>
        </S.single>
      </S.row>
    );
  };

  const ErrorComponent = () => (
    <S.row>
      <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
      <S.expired>Unable to get status</S.expired>
    </S.row>
  );

  if (!swap?.id) return null;

  if (!swap.boltz?.status) {
    return <ErrorComponent />;
  }

  switch (swap.boltz.status) {
    case EXPIRED:
      return (
        <S.row>
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <S.expired>Expired</S.expired>
        </S.row>
      );
    case REFUNDED:
      return (
        <S.row>
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <S.warning>Refunded</S.warning>
        </S.row>
      );
    case CREATED:
      return <ReadyComponent />;
    case MEMPOOL:
      return (
        <S.row>
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <S.single>
            <S.warning>Waiting for confirmation</S.warning>
            <ColorButton
              onClick={() =>
                dispatch({
                  type: 'claim',
                  claim: index,
                  claimType: MEMPOOL,
                  claimTransaction: swap.boltz?.transaction?.hex || '',
                })
              }
              arrow={true}
              withMargin={'0 0 0 4px'}
            >
              Claim Instantly
            </ColorButton>
          </S.single>
        </S.row>
      );
    case CONFIRMED:
      return (
        <S.row>
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <S.single>
            <S.claiming>Ready to Claim</S.claiming>
            <ColorButton
              onClick={() =>
                dispatch({
                  type: 'claim',
                  claim: index,
                  claimType: CONFIRMED,
                  claimTransaction: swap.boltz?.transaction?.hex || '',
                })
              }
              arrow={true}
              withMargin={'0 0 0 4px'}
            >
              Claim
            </ColorButton>
          </S.single>
        </S.row>
      );
    case SETTLED:
      return (
        <S.row>
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <S.single>
            {getTransactionLink(swap.claimTransaction)}
            <S.finished>Completed</S.finished>
          </S.single>
        </S.row>
      );
    default:
      return <ErrorComponent />;
  }
};

export const SwapStatus = () => {
  const { swaps, open, claim } = useSwapsState();
  const dispatch = useSwapsDispatch();

  const [enriched, setEnriched] = useState<EnrichedSwap[]>([]);

  const { data, refetch, networkStatus } = useGetBoltzSwapStatusQuery({
    notifyOnNetworkStatusChange: true,
    variables: { ids: swaps.map((s: { id: string }) => s.id).filter(Boolean) },
    fetchPolicy: 'network-only',
    skip: !swaps.length,
  });

  const loading = [1, 2, 3, 4, 6].includes(networkStatus);

  useEffect(() => {
    if (loading || !data?.getBoltzSwapStatus) return;

    const swapsWithState: EnrichedSwap[] = swaps.map(swap => {
      const status = data.getBoltzSwapStatus.find(s => s?.id === swap.id);
      const enriched = { ...swap, boltz: status?.boltz };
      return enriched;
    });

    setEnriched(swapsWithState);
  }, [data, loading, swaps]);

  const handleCleanup = () => {
    const cleaned = enriched.filter(s => {
      if (!s.boltz?.status) return true;
      const status = s.boltz.status;
      if (status === SETTLED || status === REFUNDED || status === EXPIRED) {
        return false;
      }
      return true;
    });

    dispatch({ type: 'cleanup', swaps: cleaned });
  };

  if (loading) {
    return (
      <>
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          <SubTitle>Swap History</SubTitle>
          <Separation />
          <DarkSubTitle>Loading swap statuses...</DarkSubTitle>
        </Card>
      </>
    );
  }

  if (!swaps.length || !data?.getBoltzSwapStatus) {
    return (
      <>
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          <SubTitle>Swap History</SubTitle>
          <Separation />
          <DarkSubTitle>You have not started any swaps.</DarkSubTitle>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card mobileCardPadding={'0'} mobileNoBackground={true}>
        <SingleLine>
          <SubTitle>Swap History</SubTitle>
          <SingleLine>
            <ColorButton
              disabled={loading}
              onClick={() => refetch()}
              withMargin="0 4px 0 0"
            >
              <RefreshCw size={18} />
            </ColorButton>
            <div data-tip data-for={`cleanup`}>
              <ColorButton disabled={loading} onClick={handleCleanup}>
                <Trash size={18} />
              </ColorButton>
            </div>
          </SingleLine>
        </SingleLine>
        <Separation />
        {enriched.map((swap, index) => (
          <Fragment key={`${swap?.id}-${index}`}>
            <SwapRow swap={swap} index={index} />
          </Fragment>
        ))}
      </Card>
      <ReactTooltip id={`cleanup`}>
        Cleanup expired, refunded and completed swaps.
      </ReactTooltip>
      <Modal
        isOpen={typeof open === 'number' || typeof claim === 'number'}
        closeCallback={() => dispatch({ type: 'close' })}
      >
        {typeof open === 'number' ? <SwapQuote /> : <SwapClaim />}
      </Modal>
    </>
  );
};
