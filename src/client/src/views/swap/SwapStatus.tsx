import { Fragment, useEffect, useState } from 'react';
import { RefreshCw, Trash, ChevronRight } from 'lucide-react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Button } from '@/components/ui/button';
import { getAddressLink } from '../../components/generic/helpers';
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
import { SwapClaim } from './SwapClaim';
import { useSwapsDispatch, useSwapsState } from './SwapContext';
import { useSwapExpire } from './SwapExpire';
import { SwapQuote } from './SwapQuote';
import { EnrichedSwap } from './types';

const CREATED = 'swap.created';
export const MEMPOOL = 'transaction.mempool';
const CONFIRMED = 'transaction.confirmed';
const SETTLED = 'invoice.settled';
const EXPIRED = 'swap.expired';
const INVOICE_EXPIRED = 'invoice.expired';
const REFUNDED = 'transaction.refunded';

const SwapRow = ({ swap, index }: { swap: EnrichedSwap; index: number }) => {
  const dispatch = useSwapsDispatch();

  const ReadyComponent = () => {
    const time = useSwapExpire(swap.decodedInvoice?.expires_at);
    return (
      <div className="flex w-full justify-between items-center mb-2 text-sm">
        <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
        <div className="flex items-center">
          <div
            className="rounded-lg p-1 px-2"
            style={{
              border: `1px solid ${chartColors.green}`,
              backgroundColor: 'rgba(10, 255, 59, 0.05)',
            }}
          >
            Ready to Pay {time}
          </div>
          <Button
            variant="outline"
            onClick={() => dispatch({ type: 'open', open: index })}
            style={{ margin: '0 0 0 4px' }}
          >
            Pay <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    );
  };

  const ErrorComponent = () => (
    <div className="flex w-full justify-between items-center mb-2 text-sm">
      <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
      <div
        className="rounded-lg p-1 px-2"
        style={{
          border: `1px solid ${chartColors.orange}`,
          backgroundColor: 'rgba(255, 193, 10, 0.1)',
        }}
      >
        Unable to get status
      </div>
    </div>
  );

  if (!swap?.id) return null;

  if (!swap.boltz?.status) {
    return <ErrorComponent />;
  }

  switch (swap.boltz.status) {
    case INVOICE_EXPIRED:
    case EXPIRED:
      return (
        <div className="flex w-full justify-between items-center mb-2 text-sm">
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <div
            className="rounded-lg p-1 px-2"
            style={{
              border: `1px solid ${chartColors.orange}`,
              backgroundColor: 'rgba(255, 193, 10, 0.1)',
            }}
          >
            Expired
          </div>
        </div>
      );
    case REFUNDED:
      return (
        <div className="flex w-full justify-between items-center mb-2 text-sm">
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <div
            className="rounded-lg p-1 px-2"
            style={{
              border: `1px solid ${chartColors.darkyellow}`,
              backgroundColor: 'rgba(255, 193, 10, 0.1)',
            }}
          >
            Refunded
          </div>
        </div>
      );
    case CREATED:
      return <ReadyComponent />;
    case MEMPOOL:
      return (
        <div className="flex w-full justify-between items-center mb-2 text-sm">
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <div className="flex items-center">
            {getAddressLink(swap.receivingAddress)}
            <div
              className="rounded-lg p-1 px-2"
              style={{
                border: `1px solid ${chartColors.darkyellow}`,
                backgroundColor: 'rgba(255, 193, 10, 0.1)',
              }}
            >
              Waiting for confirmation
            </div>
            <Button
              variant="outline"
              onClick={() =>
                dispatch({
                  type: 'claim',
                  claim: index,
                  claimType: MEMPOOL,
                })
              }
              style={{ margin: '0 0 0 4px' }}
            >
              Claim Instantly <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      );
    case CONFIRMED:
      return (
        <div className="flex w-full justify-between items-center mb-2 text-sm">
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <div className="flex items-center">
            {getAddressLink(swap.receivingAddress)}
            <div
              className="rounded-lg p-1 px-2"
              style={{
                border: `1px solid ${chartColors.green}`,
                backgroundColor: 'rgba(10, 255, 59, 0.05)',
                color: chartColors.green,
              }}
            >
              Ready to Claim
            </div>
            <Button
              variant="outline"
              onClick={() =>
                dispatch({
                  type: 'claim',
                  claim: index,
                  claimType: CONFIRMED,
                })
              }
              style={{ margin: '0 0 0 4px' }}
            >
              Claim <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      );
    case SETTLED:
      return (
        <div className="flex w-full justify-between items-center mb-2 text-sm">
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <div className="flex items-center">
            {getAddressLink(swap.receivingAddress)}
            <div
              className="rounded-lg p-1 px-2"
              style={{
                border: `1px solid ${themeColors.grey8}`,
                backgroundColor: 'rgba(10, 255, 59, 0.05)',
              }}
            >
              Completed
            </div>
            <Button
              variant="outline"
              onClick={() =>
                dispatch({
                  type: 'claim',
                  claim: index,
                  claimType: CONFIRMED,
                })
              }
              style={{ margin: '0 0 0 4px' }}
            >
              Claim <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      );
    default:
      return (
        <div className="flex w-full justify-between items-center mb-2 text-sm">
          <DarkSubTitle>{`Id: ${swap.id}`}</DarkSubTitle>
          <div className="flex items-center">
            {getAddressLink(swap.receivingAddress)}
            <div
              className="rounded-lg p-1 px-2"
              style={{
                border: `1px solid ${chartColors.orange}`,
                backgroundColor: 'rgba(255, 193, 10, 0.1)',
              }}
            >
              {swap.boltz.status}
            </div>
          </div>
        </div>
      );
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
      if (
        status === SETTLED ||
        status === REFUNDED ||
        status === EXPIRED ||
        status === INVOICE_EXPIRED
      ) {
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
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => refetch()}
              style={{ margin: '0 4px 0 0' }}
            >
              <RefreshCw size={18} />
            </Button>
            <div data-tip data-for={`cleanup`}>
              <Button
                variant="outline"
                disabled={loading}
                onClick={handleCleanup}
              >
                <Trash size={18} />
              </Button>
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
