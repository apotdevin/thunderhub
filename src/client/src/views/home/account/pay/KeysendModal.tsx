import { FC, useState } from 'react';
import { useGetNodeQuery } from '../../../../graphql/queries/__generated__/getNode.generated';
import { useKeysendMutation } from '../../../../graphql/mutations/__generated__/keysend.generated';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../../utils/error';
import { Input } from '@/components/ui/input';
import { Price } from '../../../../components/price/Price';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  SingleLine,
  SubTitle,
  Separation,
  DarkSubTitle,
} from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';

export const WithMargin = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mr-1 ${className ?? ''}`} {...props}>
    {children}
  </div>
);

export const Centered = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`text-center ${className ?? ''}`} {...props}>
    {children}
  </div>
);

interface KeysendProps {
  publicKey: string;
  handleReset: () => void;
}

export const KeysendModal: FC<KeysendProps> = ({ publicKey, handleReset }) => {
  const [tokens, setTokens] = useState(0);

  const { data, loading, error } = useGetNodeQuery({
    variables: { publicKey },
  });

  const [keysend, { loading: keysendLoading }] = useKeysendMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent');
      handleReset();
    },
    refetchQueries: ['GetNodeInfo', 'GetBalances'],
  });

  if (error) {
    return (
      <Centered>
        <SubTitle>Error getting node with that public key.</SubTitle>
        <DarkSubTitle>
          Please verify you copied the public key correctly.
        </DarkSubTitle>
      </Centered>
    );
  }
  if (loading || !data || !data.getNode) {
    return <LoadingCard noCard={true} />;
  }

  const alias = data.getNode.node?.alias || 'Unknown';

  const handleEnter = () => {
    if (loading || keysendLoading) return;
    keysend({ variables: { destination: publicKey, tokens } });
  };

  return (
    <>
      <SingleLine>
        <SubTitle>Pay Node</SubTitle>
        <div>{alias}</div>
      </SingleLine>
      <Separation />
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Sats</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={tokens} />
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          type={'number'}
          value={tokens && tokens > 0 ? tokens : ''}
          onChange={e => setTokens(Number(e.target.value))}
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
        />
      </div>
      <DarkSubTitle withMargin={'16px 0'}>
        Remember keysend is an experimental feature. Use at your own risk.
      </DarkSubTitle>
      <Button
        variant="outline"
        onClick={() => handleEnter()}
        disabled={loading || keysendLoading}
        style={{ margin: '16px 0 0' }}
        className="w-full"
      >
        {keysendLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>Send</>
        )}
      </Button>
    </>
  );
};
