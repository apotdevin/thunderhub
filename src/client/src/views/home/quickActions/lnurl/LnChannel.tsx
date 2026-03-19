import { FC } from 'react';
import { ChannelRequest } from '../../../../graphql/types';
import { Title } from '../../../../components/typography/Styled';
import { Separator } from '@/components/ui/separator';
import {
  getNodeLink,
  renderLine,
} from '../../../../components/generic/helpers';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useChannelLnUrlMutation } from '../../../../graphql/mutations/__generated__/lnUrl.generated';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../../utils/error';

type LnChannelProps = {
  request: ChannelRequest;
};

export const LnChannel: FC<LnChannelProps> = ({ request }) => {
  const { k1, callback, uri } = request;

  const split = uri?.split('@');

  const [channelLnUrl, { data, loading }] = useChannelLnUrlMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => toast.success(data.lnUrlChannel),
  });

  if (!callback || !k1 || !uri) {
    return (
      <div className="w-full text-center">
        Missing information from LN Service
      </div>
    );
  }

  const callbackUrl = new URL(callback);

  return (
    <>
      <Title>Channel</Title>
      <Separator />
      <div className="w-full text-center">{`Request from ${callbackUrl.host}`}</div>
      <Separator />
      {split?.[0] && renderLine('Peer', getNodeLink(split[0]))}
      <Separator />
      <Button
        variant="outline"
        disabled={loading || !!data?.lnUrlChannel}
        className="w-full"
        style={{ margin: '16px 0 0' }}
        onClick={() => {
          channelLnUrl({ variables: { uri, k1, callback } });
        }}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>{`Initiate Channel Request`}</>
        )}
      </Button>
    </>
  );
};
