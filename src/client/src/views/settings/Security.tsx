import { FC, useState } from 'react';
import { SettingsLine } from '../../pages/SettingsPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2 } from 'lucide-react';
import {
  Card,
  CardWithTitle,
  Separation,
  Sub4Title,
  SubTitle,
} from '../../components/generic/Styled';
import { useGetTwofaSecretQuery } from '../../graphql/queries/__generated__/getTwofaSecret.generated';
import { useAccount } from '../../hooks/UseAccount';
import { QRCodeSVG } from 'qrcode.react';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { useRemoveTwofaSecretMutation } from '../../graphql/mutations/__generated__/removeTwofaSecret.generated';
import toast from 'react-hot-toast';
import { useUpdateTwofaSecretMutation } from '../../graphql/mutations/__generated__/updateTwofaSecret.generated';
import { config } from '../../config/thunderhubConfig';

const Enable: FC<{ callback: () => void }> = ({ callback }) => {
  const [token, setToken] = useState<string>('');
  const { data, loading, error } = useGetTwofaSecretQuery();

  const [update, { loading: updateLoading }] = useUpdateTwofaSecretMutation({
    onCompleted: () => {
      callback();
      toast.success('Updated 2FA for account');
    },
    refetchQueries: ['GetAccount'],
    onError: ({ graphQLErrors }) => {
      const messages = graphQLErrors.map(e => (
        <div key={e.message}>{e.message}</div>
      ));
      toast.error(<div>{messages}</div>);
    },
  });

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (error?.message) {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        {error.message}
      </div>
    );
  }

  if (!data?.getTwofaSecret.url) {
    return (
      <div className="w-full flex flex-col justify-center items-center">
        Unable to get secret to enable 2FA.
      </div>
    );
  }

  const handleClick = () => {
    update({ variables: { token, secret: data.getTwofaSecret.secret } });
  };

  return (
    <>
      <Separation />
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-[280px] h-[280px] m-4 bg-white p-4">
          <QRCodeSVG value={data.getTwofaSecret.url} size={248} />
        </div>
        {data.getTwofaSecret.secret}
      </div>
      <Separation />
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>2FA</span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          type="number"
          placeholder="2FA Token"
          value={token}
          onChange={e => setToken(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleClick()}
        />
      </div>
      <Button
        variant="outline"
        style={{ margin: '16px 0 0' }}
        className="w-full"
        disabled={!token || updateLoading}
        onClick={handleClick}
      >
        {updateLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>Enable</>
        )}
      </Button>
    </>
  );
};

const Disable: FC<{ callback: () => void }> = ({ callback }) => {
  const [token, setToken] = useState<string>('');
  const [remove, { loading }] = useRemoveTwofaSecretMutation({
    onCompleted: () => {
      callback();
      toast.success('Removed 2FA for account');
    },
    refetchQueries: ['GetAccount'],
    onError: ({ graphQLErrors }) => {
      const messages = graphQLErrors.map(e => (
        <div key={e.message}>{e.message}</div>
      ));
      toast.error(<div>{messages}</div>);
    },
  });

  const handleClick = () => {
    remove({ variables: { token } });
  };

  return (
    <>
      <Separation />
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>2FA</span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          type="number"
          placeholder="2FA Token"
          value={token}
          onChange={e => setToken(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleClick()}
        />
      </div>
      <Button
        variant="outline"
        style={{ margin: '16px 0 0' }}
        className="w-full"
        disabled={!token || loading}
        onClick={handleClick}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>Disable</>
        )}
      </Button>
    </>
  );
};

export const Security = () => {
  const user = useAccount();
  const [enable, setEnabled] = useState<boolean>(false);

  if (!user || config.disable2FA) {
    return null;
  }

  const renderContent = () => {
    if (user.twofaEnabled) {
      return (
        <>
          <SettingsLine>
            <Sub4Title>Disable 2FA</Sub4Title>
            <Button variant="outline" onClick={() => setEnabled(p => !p)}>
              {enable ? (
                'Cancel'
              ) : (
                <>Disable {!enable && <ChevronRight size={18} />}</>
              )}
            </Button>
          </SettingsLine>
          {enable ? <Disable callback={() => setEnabled(false)} /> : null}
        </>
      );
    }
    return (
      <>
        <SettingsLine>
          <Sub4Title>Enable 2FA</Sub4Title>
          <Button variant="outline" onClick={() => setEnabled(p => !p)}>
            {enable ? (
              'Cancel'
            ) : (
              <>Enable {!enable && <ChevronRight size={18} />}</>
            )}
          </Button>
        </SettingsLine>
        {enable ? <Enable callback={() => setEnabled(false)} /> : null}
      </>
    );
  };

  return (
    <CardWithTitle>
      <SubTitle>Security</SubTitle>
      <Card>{renderContent()}</Card>
    </CardWithTitle>
  );
};
