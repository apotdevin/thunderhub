import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Radio,
  Copy,
  Globe,
  Shield,
  Key,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetNodeInfoQuery } from '../../../graphql/queries/__generated__/getNodeInfo.generated';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';

const truncate = (str: string, start = 8, end = 8) =>
  str.length > start + end + 3
    ? `${str.slice(0, start)}...${str.slice(-end)}`
    : str;

const CopyRow = ({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string;
  icon: typeof Key;
  iconClassName?: string;
}) => {
  const copy = () =>
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success(`${label} copied`));

  return (
    <button
      type="button"
      onClick={copy}
      className="group/row flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150 hover:bg-muted/60 cursor-pointer w-full text-left"
    >
      <div className="flex items-center justify-center size-7 rounded-md bg-muted/60 shrink-0 group-hover/row:bg-muted">
        <Icon size={13} className={iconClassName} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
          {label}
        </span>
        <span className="text-xs font-mono text-foreground/80 truncate">
          {truncate(value, 12, 12)}
        </span>
      </div>
      <Copy
        size={13}
        className="shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover/row:opacity-100"
      />
    </button>
  );
};

export const ConnectCard = () => {
  const [expanded, setExpanded] = useState(false);

  const { loading, data } = useGetNodeInfoQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!data || loading) {
    return <LoadingCard title={'Connect'} />;
  }

  const { public_key, uris } = data.getNodeInfo || {};

  const onionUri = uris.find((u: string) => u.includes('onion'));
  const clearUri = uris.find((u: string) => !u.includes('onion'));
  const hasAddresses = !!onionUri || !!clearUri;

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-7 rounded-lg bg-primary/10">
              <Radio size={14} className="text-primary" />
            </div>
            <CardTitle>Connect</CardTitle>
          </div>
          {hasAddresses && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground"
              onClick={() => setExpanded(s => !s)}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="-mx-3 -my-1">
          <CopyRow
            label="Public Key"
            value={public_key}
            icon={Key}
            iconClassName="text-violet-500"
          />
          {expanded && (
            <>
              {onionUri && (
                <CopyRow
                  label="Tor (Onion)"
                  value={onionUri}
                  icon={Shield}
                  iconClassName="text-emerald-500"
                />
              )}
              {clearUri && (
                <CopyRow
                  label="Clearnet (IP)"
                  value={clearUri}
                  icon={Globe}
                  iconClassName="text-blue-500"
                />
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
