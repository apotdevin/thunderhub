import { ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { TradingOffers } from '../views/assets/TradingOffers';
import { useGetNodeCapabilitiesQuery } from '../graphql/queries/__generated__/getNodeCapabilities.generated';
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

const TradingPage = () => {
  const { data, loading } = useGetNodeCapabilitiesQuery();
  const tapdAvailable =
    data?.node?.capabilities?.list?.includes('taproot_assets') ?? false;

  return (
    <GridWrapper centerContent={false}>
      {loading || tapdAvailable ? <TradingOffers /> : <TapdSetupPrompt />}
    </GridWrapper>
  );
};

export default TradingPage;
