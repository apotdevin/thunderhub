import styled, { keyframes } from 'styled-components';
import { Card, SmallButton } from '../../../components/generic/Styled';
import { useGetLiquidityPerUsdQuery } from '../../../graphql/queries/__generated__/getLiquidityPerUsd.generated';
import { useEffect, useState } from 'react';
import { InputWithDeco } from '../../../components/input/InputWithDeco';
import { formatCurrency, formatNumber } from '../../../utils/helpers';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { ChevronRight, ExternalLink, Loader } from 'lucide-react';
import { unSelectedNavButton } from '../../../styles/Themes';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import { usePurchaseLiquidityMutation } from '../../../graphql/mutations/__generated__/purchaseLiquidity.generated';
import { toast } from 'react-toastify';
import { useGetAmbossLoginTokenLazyQuery } from '../../../graphql/queries/__generated__/getAmbossLoginToken.generated';

const RecommendedBanner = styled.div`
  text-align: center;
  font-size: 14px;
  background: oklch(0.982 0.018 155.826);
  color: oklch(0.627 0.194 149.214);
  padding: 8px;
  border-radius: 8px;
`;

const InfoBanner = styled.div`
  text-align: center;
  font-size: 14px;
  background: oklch(0.97 0.014 254.604);
  color: oklch(0.546 0.245 262.881);
  padding: 8px;
  border-radius: 8px;
`;

const NoteP = styled.p`
  text-align: center;
  font-size: 12px;
  color: ${unSelectedNavButton};
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled(Loader)`
  animation: ${spin} 1s linear infinite;
`;

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
        <Spinner size={14} style={{ marginLeft: '4px' }} />
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

  return (
    <Card>
      <RecommendedBanner>
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
      </RecommendedBanner>
      <InputWithDeco
        customAmount={formattedAmount}
        title={'Purchase Amount'}
        value={amount}
        placeholder={'USD'}
        amount={amount}
        inputType={'number'}
        inputCallback={value => {
          const minAmount = Math.max(Number(value), 5);
          setAmount(minAmount);
        }}
      />

      <InfoBanner>{`${formattedAmount} will buy you ~${formattedLiquidity} sats of inbound liquidity*.`}</InfoBanner>

      <ColorButton
        withMargin={'8px 0 0'}
        loading={loading || purchaseData.loading}
        fullWidth={true}
        disabled={!amount || loading || purchaseData.loading}
        onClick={() => {
          purchase({ variables: { amount_cents: (amount * 100).toString() } });
        }}
      >
        {`Buy ${formattedAmount} of Inbound Liquidity`}
        <ChevronRight size={18} />
      </ColorButton>

      <NoteP>
        * Liquidity may be sourced from different providers that charge
        different fees, hence the estimated amounts in sats.
      </NoteP>
    </Card>
  );
};
