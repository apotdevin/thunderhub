import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
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
      <div className="w-full flex flex-col justify-center items-center text-sm text-muted-foreground">
        {error.message}
      </div>
    );
  }

  if (!data?.getTwofaSecret.url) {
    return (
      <div className="w-full flex flex-col justify-center items-center text-sm text-muted-foreground">
        Unable to get secret to enable 2FA.
      </div>
    );
  }

  const handleClick = () => {
    update({ variables: { token, secret: data.getTwofaSecret.secret } });
  };

  return (
    <div className="space-y-4 pt-2">
      <Separator />
      <div className="flex flex-col items-center gap-3">
        <div className="w-[248px] h-[248px] bg-white p-3 rounded-lg">
          <QRCodeSVG value={data.getTwofaSecret.url} size={224} />
        </div>
        <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {data.getTwofaSecret.secret}
        </code>
      </div>
      <Separator />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="number"
          placeholder="Enter 2FA token"
          value={token}
          onChange={e => setToken(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleClick()}
          className="sm:max-w-[280px]"
        />
        <Button
          className="w-full sm:w-auto"
          disabled={!token || updateLoading}
          onClick={handleClick}
        >
          {updateLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <ShieldCheck size={16} />
              Enable 2FA
            </>
          )}
        </Button>
      </div>
    </div>
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
    <div className="space-y-4 pt-2">
      <Separator />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="number"
          placeholder="Enter 2FA token"
          value={token}
          onChange={e => setToken(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleClick()}
          className="sm:max-w-[280px]"
        />
        <Button
          variant="destructive"
          className="w-full sm:w-auto"
          disabled={!token || loading}
          onClick={handleClick}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <ShieldOff size={16} />
              Disable 2FA
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export const Security = () => {
  const user = useAccount();
  const [enable, setEnabled] = useState<boolean>(false);

  if (!user || config.disable2FA) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          {user.twofaEnabled
            ? 'Two-factor authentication is enabled'
            : 'Protect your account with two-factor authentication'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {user.twofaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEnabled(p => !p)}
          >
            {enable ? (
              'Cancel'
            ) : (
              <>
                {user.twofaEnabled ? 'Disable' : 'Enable'}{' '}
                <ChevronRight size={16} />
              </>
            )}
          </Button>
        </div>
        {enable &&
          (user.twofaEnabled ? (
            <Disable callback={() => setEnabled(false)} />
          ) : (
            <Enable callback={() => setEnabled(false)} />
          ))}
      </CardContent>
    </Card>
  );
};
