import toast from 'react-hot-toast';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import { useGetBoltzInfoQuery } from '../../graphql/queries/__generated__/getBoltzInfo.generated';
import { getErrorContent } from '../../utils/error';
import { SwapsProvider } from './SwapContext';
import { StartSwap } from './StartSwap';
import { SwapStatus } from './SwapStatus';
import { ArrowLeftRight, Info, Zap } from 'lucide-react';
import { Link } from '../../components/link/Link';
import { Badge } from '@/components/ui/badge';

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
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <ArrowLeftRight className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Reverse Swap
              </h2>
              <p className="text-xs text-muted-foreground">
                Lightning to on-chain
              </p>
            </div>
          </div>
          <Link href={'https://boltz.exchange/'} newTab>
            <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1">
              <Zap size={10} />
              Powered by Boltz
            </Badge>
          </Link>
        </div>

        {/* Info bar */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium">{feePercent}%</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Min</span>
              <span className="font-medium">
                <Price amount={min} />
              </span>
            </div>
            <div className="hidden md:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Max</span>
              <span className="font-medium">
                <Price amount={max} />
              </span>
            </div>
          </div>
        </div>

        <StartSwap max={max} min={min} />
        <SwapStatus />
      </div>
    </SwapsProvider>
  );
};
