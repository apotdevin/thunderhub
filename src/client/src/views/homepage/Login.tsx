import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../utils/error';
import { Lock, Loader2 } from 'lucide-react';
import { getVersion } from '../../utils/version';
import { useGetSessionTokenMutation } from '../../graphql/mutations/__generated__/getSessionToken.generated';
import { SingleLine, Sub4Title, Card } from '../../components/generic/Styled';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChartColors } from '../../lib/chart-colors';
import { config } from '../../config/thunderhubConfig';
import { GetServerAccountsQuery } from '../../graphql/queries/__generated__/getServerAccounts.generated';

type ServerAccount = GetServerAccountsQuery['getServerAccounts'][0];

type LoginProps = {
  account: ServerAccount;
};

export const Login = ({ account }: LoginProps) => {
  const chartColors = useChartColors();
  const [pass, setPass] = useState('');
  const [token, setToken] = useState('');

  const [getSessionToken, { data, loading }] = useGetSessionTokenMutation({
    refetchQueries: ['GetNodeInfo'],
    onError: err => {
      toast.error(getErrorContent(err));
    },
  });

  useEffect(() => {
    if (loading || !data?.getSessionToken) return;
    const { mayor, minor } = getVersion(data.getSessionToken);
    if (mayor <= 0 && minor < 11) {
      toast.error(
        'ThunderHub supports LND version 0.11.0 and higher. Please update your node, you are in risk of losing funds.'
      );
    } else {
      window.location.href = `${config.basePath}/`;
    }
  }, [data, loading]);

  if (!account) return null;

  const handleEnter = () => {
    if (pass === '' || loading) return;
    getSessionToken({
      variables: { id: account.id, password: pass, token },
    });
  };

  return (
    <div className="w-full bg-transparent max-w-[1000px] mx-auto px-4 lg:px-0">
      <div className="w-full flex justify-center pb-2 font-semibold">
        <h1 className="text-2xl text-white flex items-center">
          {`Login to ${account.name}`}
          <div className="ml-1">
            <Lock size={18} color={chartColors.green} />
          </div>
        </h1>
      </div>
      <Card cardPadding={'32px'} mobileCardPadding={'16px'}>
        <SingleLine>
          <Sub4Title>Password</Sub4Title>
          <Input
            autoFocus
            style={{ maxWidth: '800px', margin: '0 0 8px 16px' }}
            type={'password'}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleEnter();
            }}
          />
        </SingleLine>
        {config.disable2FA ? null : (
          <SingleLine>
            <Sub4Title>{'2FA (if enabled)'}</Sub4Title>
            <Input
              style={{ maxWidth: '800px', margin: '0 0 0 16px' }}
              onChange={e => setToken(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleEnter();
              }}
            />
          </SingleLine>
        )}
        <Button
          variant="outline"
          disabled={pass === '' || loading}
          onClick={() => handleEnter()}
          style={{ margin: '16px 0 0' }}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>Connect</>
          )}
        </Button>
      </Card>
    </div>
  );
};
