import { useState } from 'react';
import toast from 'react-hot-toast';
import { Radio, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { renderLine } from '../../../components/generic/helpers';
import { useGetNodeInfoQuery } from '../../../graphql/queries/__generated__/getNodeInfo.generated';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import {
  CardWithTitle,
  CardTitle,
  SubTitle,
  Card,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';

export const ConnectCard = () => {
  const [open, openSet] = useState<boolean>(false);

  const { loading, data } = useGetNodeInfoQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!data || loading) {
    return <LoadingCard title={'Connect'} />;
  }

  const { public_key, uris } = data.getNodeInfo || {};

  const onionAddress = uris.find((uri: string) => uri.indexOf('onion') >= 0);
  const normalAddress = uris.find((uri: string) => uri.indexOf('onion') < 0);

  let clear: string | null = null;
  let tor: string | null = null;

  if (normalAddress) {
    clear = normalAddress.split('@')[1];
  }
  if (onionAddress) {
    tor = onionAddress.split('@')[1];
  }

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Connect</SubTitle>
      </CardTitle>
      <Card>
        <div className="flex justify-between items-center flex-col md:flex-row gap-4">
          <div>
            <Radio size={18} className="text-primary" />
          </div>

          <div className="flex flex-col justify-between items-start w-full">
            <DarkSubTitle>Public Key</DarkSubTitle>
            <div className="text-ellipsis break-all">{public_key}</div>
          </div>

          <div className="flex gap-2">
            {onionAddress ? (
              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard
                    .writeText(onionAddress)
                    .then(() => toast.success('Onion Address Copied'))
                }
              >
                <Copy size={18} />
                <span className="ml-1">Onion</span>
              </Button>
            ) : null}
            {normalAddress ? (
              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard
                    .writeText(normalAddress)
                    .then(() => toast.success('Public Address Copied'))
                }
              >
                <Copy size={18} />
              </Button>
            ) : null}
            <Button variant="outline" onClick={() => openSet(s => !s)}>
              {open ? <X size={18} /> : 'Details'}
            </Button>
          </div>
        </div>
        {open && (
          <>
            <Separation />
            {renderLine('Public Key', public_key)}
            {clear && renderLine('IP', clear)}
            {tor && renderLine('TOR', tor)}
          </>
        )}
      </Card>
    </CardWithTitle>
  );
};
