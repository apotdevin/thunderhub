import { Card, SmallButton } from '../../../components/generic/Styled';
import { useGetLiquidityPerUsdQuery } from '../../../graphql/queries/__generated__/getLiquidityPerUsd.generated';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatNumber } from '../../../utils/helpers';
import { Button } from '@/components/ui/button';
import { ChevronRight, ExternalLink, Loader2 } from 'lucide-react';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { usePurchaseLiquidityMutation } from '../../../graphql/mutations/__generated__/purchaseLiquidity.generated';
import toast from 'react-hot-toast';
import { useGetAmbossLoginTokenLazyQuery } from '../../../graphql/queries/__generated__/getAmbossLoginToken.generated';

export const GoToMagma = () => {
  const [getToken, { data, loading: tokenLoading }] =
    useGetAmbossLoginTokenLazyQuery({
      fetchPolicy: 'network-only',
      onError: () => toast.error('Error getting auth token'),
    });

  useEffect(() => {
    if (!data?.getAmbossLoginToken || tokenLoading) {
      return;
    }
    if (!window?.open) return;

    const url = data.getAmbossLoginToken;
    (window as any).open(url, '_blank').focus();
  }, [data, tokenLoading]);

  return (
    <SmallButton
      disabled={tokenLoading}
      onClick={() => {
        getToken({
          variables: { redirect_url: 'https://magma.amboss.tech/oauth' },
        });
      }}
    >
      {`Go to Magma`}
      {!tokenLoading ? (
        <ExternalLink size={14} style={{ marginLeft: '4px' }} />
      ) : (
        <Loader2
          className="animate-spin"
          size={14}
          style={{ marginLeft: '4px' }}
        />
      )}
    </SmallButton>
  );
};

export const BuyChannel = () => {
  const [amount, setAmount] = useState<number>(5);

  const { data, loading, error } = useGetLiquidityPerUsdQuery();

  const [purchase, purchaseData] = usePurchaseLiquidityMutation({
    onCompleted: () => {
      toast.success('Liquidity Purchased!');
    },

    onError: ({ graphQLErrors }) => {
      const messages = graphQLErrors.map(e => (
        <div key={e.message}>{e.message}</div>
      ));
      toast.error(<div>{messages}</div>);
    },
  });

  if (loading) return <LoadingCard />;

  if (!data?.getLiquidityPerUsd || error) {
    return <Card>Error getting liquidity information. Please try again.</Card>;
  }

  const formattedAmount = formatCurrency(amount, 'USD');
  const formattedLiquidity = formatNumber(
    Number(data.getLiquidityPerUsd) * amount
  );

  const isLoading = loading || purchaseData.loading;

  return (
    <Card>
      <div className="text-center text-sm bg-[oklch(0.982_0.018_155.826)] text-[oklch(0.627_0.194_149.214)] p-2 rounded-lg">
        Secure liquidity from the{' '}
        <a
          style={{ color: 'inherit' }}
          href={'https://amboss.tech/rails/stats'}
          target="__blank"
        >
          Amboss Rails cluster
        </a>{' '}
        or{' '}
        <a
          style={{ color: 'inherit' }}
          href={'https://magma.amboss.tech/buy'}
          target="__blank"
        >
          Magma sellers
        </a>{' '}
        to ensure you can accept payments reliably.
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Purchase Amount</span>
          <span className="text-muted-foreground mx-2 ml-4">
            {formattedAmount}
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'USD'}
          type={'number'}
          value={amount && amount > 0 ? amount : ''}
          onChange={e => {
            const minAmount = Math.max(Number(e.target.value), 5);
            setAmount(minAmount);
          }}
        />
      </div>

      <div className="text-center text-sm bg-[oklch(0.97_0.014_254.604)] text-[oklch(0.546_0.245_262.881)] p-2 rounded-lg">
        {`${formattedAmount} will buy you ~${formattedLiquidity} sats of inbound liquidity*.`}
      </div>

      <Button
        variant="outline"
        style={{ margin: '8px 0 0' }}
        className="w-full"
        disabled={!amount || isLoading}
        onClick={() => {
          purchase({ variables: { amount_cents: (amount * 100).toString() } });
        }}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            {`Buy ${formattedAmount} of Inbound Liquidity`}{' '}
            <ChevronRight size={18} />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        * Liquidity may be sourced from different providers that charge
        different fees, hence the estimated amounts in sats.
      </p>
    </Card>
  );
};
