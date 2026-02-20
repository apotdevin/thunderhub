import toast from 'react-hot-toast';
import { renderLine } from '../../components/generic/helpers';
import {
  Card,
  DarkSubTitle,
  SingleLine,
  SubTitle,
} from '../../components/generic/Styled';
import { Link } from '../../components/link/Link';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import { Subtitle } from '../../components/typography/Styled';
import { useGetBoltzInfoQuery } from '../../graphql/queries/__generated__/getBoltzInfo.generated';
import { getErrorContent } from '../../utils/error';
import { SwapsProvider } from './SwapContext';
import { StartSwap } from './StartSwap';
import { SwapStatus } from './SwapStatus';

export const SwapView = () => {
  const { data, loading, error } = useGetBoltzInfoQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading) {
    return <LoadingCard title={'Swap'} />;
  }

  if (error || !data?.getBoltzInfo) {
    return (
      <Card mobileCardPadding={'0'} mobileNoBackground={true}>
        Unable to connect to Boltz
      </Card>
    );
  }

  const { max, min, feePercent } = data.getBoltzInfo;

  return (
    <SwapsProvider>
      <SingleLine>
        <Subtitle>Reverse Swap</Subtitle>
        <DarkSubTitle>
          <Link href={'https://boltz.exchange/'}>powered by Boltz</Link>
        </DarkSubTitle>
      </SingleLine>
      <Card mobileCardPadding={'0'} mobileNoBackground={true}>
        <SubTitle>Information</SubTitle>
        {renderLine('Boltz fee', `${feePercent}%`)}
        {renderLine('Minimum amount', <Price amount={min} />)}
        {renderLine('Maximum amount', <Price amount={max} />)}
      </Card>
      <StartSwap max={max} min={min} />
      <SwapStatus />
    </SwapsProvider>
  );
};
