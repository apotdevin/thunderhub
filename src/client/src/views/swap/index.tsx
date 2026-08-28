import toast from 'react-hot-toast';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import { useGetBoltzInfoQuery } from '../../graphql/queries/__generated__/getBoltzInfo.generated';
import { getErrorContent } from '../../utils/error';
import { StartSwap } from './StartSwap';
import { SwapStatus } from './SwapStatus';
import { Info, Zap } from 'lucide-react';
import { Link } from '../../components/link/Link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BoltzDisabledNotice } from './BoltzDisabledNotice';
import { BOLTZ_SWAPS_DISABLED, BOLTZ_STATUS_URL } from './boltzDisabled';

const StartSwapCard = () => {
  const { data, loading, error } = useGetBoltzInfoQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading) {
    return <LoadingCard title={'Swap'} />;
  }

  if (error || !data?.getBoltzInfo) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Info className="mr-2" size={16} />
        Unable to connect to Boltz
      </div>
    );
  }

  const { max, min, feePercent } = data.getBoltzInfo;

  return (
    <>
      <div className="flex items-center gap-2 self-end">
        <Badge variant="secondary" className="gap-1.5">
          Fee {feePercent}%
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          Min <Price amount={min} />
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          Max <Price amount={max} />
        </Badge>
        <Link href={BOLTZ_STATUS_URL} newTab>
          <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1">
            <Zap size={10} />
            Boltz
          </Badge>
        </Link>
      </div>

      <Card>
        <CardContent>
          <StartSwap max={max} min={min} />
        </CardContent>
      </Card>
    </>
  );
};

export const SwapView = () => (
  <div className="flex flex-col gap-4">
    <h2 className="text-lg font-semibold">Reverse Swap</h2>

    {BOLTZ_SWAPS_DISABLED ? <BoltzDisabledNotice /> : <StartSwapCard />}

    <SwapStatus />
  </div>
);
