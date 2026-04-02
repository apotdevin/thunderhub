import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../utils/error';
import { Loader2 } from 'lucide-react';
import { getVersion } from '../../utils/version';
import { useGetSessionTokenMutation } from '../../graphql/mutations/__generated__/getSessionToken.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { config } from '../../config/thunderhubConfig';
import { GetServerAccountsQuery } from '../../graphql/queries/__generated__/getServerAccounts.generated';

type ServerAccount = GetServerAccountsQuery['public']['get_server_accounts'][0];

type LoginProps = {
  account: ServerAccount;
};

export const Login = ({ account }: LoginProps) => {
  const [pass, setPass] = useState('');
  const [token, setToken] = useState('');

  const [getSessionToken, { data, loading }] = useGetSessionTokenMutation({
    refetchQueries: ['GetNodeInfo'],
    onError: err => {
      toast.error(getErrorContent(err));
    },
  });

  useEffect(() => {
    if (loading || !data?.public?.get_session_token) return;
    const { mayor, minor } = getVersion(data.public.get_session_token);
    if (mayor <= 0 && minor < 11) {
      toast.error(
        'ThunderHub supports LND version 0.11.0 and higher. Please update your node, you are in risk of losing funds.'
      );
    } else {
      window.location.href = `${config.basePath}/${account.slug}/home`;
    }
  }, [data, loading, account.slug]);

  if (!account) return null;

  const handleEnter = () => {
    if (pass === '' || loading) return;
    getSessionToken({
      variables: { id: account.id, password: pass, token },
    });
  };

  return (
    <div className="mx-auto w-full max-w-md px-4">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            {account.name}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Enter your credentials to connect
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>
            <Input
              autoFocus
              type="password"
              placeholder="Enter password"
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleEnter();
              }}
            />
          </div>

          {!config.disable2FA && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                2FA Code{' '}
                <span className="text-foreground/40">(if enabled)</span>
              </label>
              <Input
                placeholder="6-digit code"
                onChange={e => setToken(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleEnter();
                }}
              />
            </div>
          )}

          <Button
            disabled={pass === '' || loading}
            onClick={handleEnter}
            className="mt-1 w-full"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Connect'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
