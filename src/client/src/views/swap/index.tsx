import toast from 'react-hot-toast';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import { useGetBoltzInfoQuery } from '../../graphql/queries/__generated__/getBoltzInfo.generated';
import { getErrorContent } from '../../utils/error';
import { SwapsProvider } from './SwapContext';
import { StartSwap } from './StartSwap';
import { SwapStatus } from './SwapStatus';
import { Info, Zap } from 'lucide-react';
import { Link } from '../../components/link/Link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const SwapView = () => {
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
    <SwapsProvider>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Reverse Swap</h2>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              Fee {feePercent}%
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              Min <Price amount={min} />
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              Max <Price amount={max} />
            </Badge>
            <Link href={'https://boltz.exchange/'} newTab>
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full px-3 py-1"
              >
                <Zap size={10} />
                Boltz
              </Badge>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent>
            <StartSwap max={max} min={min} />
          </CardContent>
        </Card>
        <SwapStatus />
      </div>
    </SwapsProvider>
  );
};
