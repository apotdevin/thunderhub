import { ExternalLink, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { TradingGrid } from '../views/assets/TradingGrid';
import { TradingReadiness } from '../views/assets/TradingReadiness';
import { useGetTradeReadinessQuery } from '../graphql/queries/__generated__/getTradeReadiness.generated';
import { LITD_SETUP_DOCS_URL } from '../utils/externalLinks';

const TapdSetupPrompt = () => (
  <div className="flex flex-col items-center gap-4 rounded-md border border-border bg-muted/30 px-6 py-10 text-center">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Info size={16} />
      Taproot Assets are not available on this node
    </div>
    <p className="max-w-md text-sm text-muted-foreground">
      Trading requires a node running Lightning Terminal (litd) with the Taproot
      Assets daemon (tapd) enabled. Follow the docs to get started.
    </p>
    <Button asChild size="sm">
      <a href={LITD_SETUP_DOCS_URL} target="_blank" rel="noopener noreferrer">
        View litd + tapd setup docs
        <ExternalLink size={14} className="ml-2" />
      </a>
    </Button>
  </div>
);

const TradingPageContent = () => {
  const { data, loading, error, refetch } = useGetTradeReadinessQuery({
    fetchPolicy: 'cache-and-network',
  });

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  const readiness = data?.rails?.trade_readiness;

  if (error && !readiness) {
    return (
      <div className="px-4 py-4">
        <TapdSetupPrompt />
      </div>
    );
  }

  if (!readiness) {
    return (
      <div className="px-4 py-4">
        <TapdSetupPrompt />
      </div>
    );
  }

  const isReady =
    readiness.node_online &&
    readiness.has_tapd &&
    (Number(readiness.onchain_balance_sats) > 0 ||
      Number(readiness.pending_onchain_balance_sats) > 0) &&
    readiness.has_active_channel;

  if (!isReady) {
    return (
      <div className="px-4 py-4">
        <TradingReadiness
          data={readiness}
          refetch={refetch}
          loading={loading}
        />
      </div>
    );
  }

  return <TradingGrid />;
};

const TradingPage = () => (
  <GridWrapper centerContent={false} noPadding>
    <TradingPageContent />
  </GridWrapper>
);

export default TradingPage;
