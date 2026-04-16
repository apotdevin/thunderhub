import { useState } from 'react';
import { ExternalLink, Gem, X } from 'lucide-react';
import { useGetNodeCapabilitiesQuery } from '../../../graphql/queries/__generated__/getNodeCapabilities.generated';
import { LITD_SETUP_DOCS_URL } from '../../../utils/externalLinks';

const DISMISSED_KEY = 'ta_setup_banner_dismissed';

export const TaprootAssetsUpsellCard = () => {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISSED_KEY) === '1'
  );

  const { data, loading } = useGetNodeCapabilitiesQuery();
  const tapdAvailable =
    data?.node?.capabilities?.list?.includes('taproot_assets') ?? false;

  if (loading || tapdAvailable || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2">
      <Gem size={14} className="shrink-0 text-primary" />
      <span className="flex-1 text-xs text-muted-foreground">
        Enable{' '}
        <a
          href={LITD_SETUP_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Taproot Assets
          <ExternalLink size={10} className="ml-0.5 inline-block" />
        </a>{' '}
        to trade and manage assets on Lightning.
      </span>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={handleDismiss}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
      >
        <X size={12} />
      </button>
    </div>
  );
};
