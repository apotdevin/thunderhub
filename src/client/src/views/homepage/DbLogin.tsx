import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { getErrorContent } from '../../utils/error';
import { useGetDbSessionTokenMutation } from '../../graphql/mutations/__generated__/getDbSessionToken.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { config } from '../../config/thunderhubConfig';
import { hashPassword } from '../../utils/crypto';

export const DbLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [getDbSessionToken, { data, loading }] = useGetDbSessionTokenMutation({
    refetchQueries: ['GetNodeInfo'],
    onError: err => {
      toast.error(getErrorContent(err));
    },
  });

  useEffect(() => {
    if (loading || !data?.public?.get_db_session_token) return;
    window.location.href = config.basePath || '/';
  }, [data, loading]);

  const handleSubmit = async () => {
    if (!email || !password || loading) return;
    const hashed = await hashPassword(password);
    getDbSessionToken({ variables: { email, password: hashed } });
  };

  return (
    <div className="mx-auto w-full max-w-md px-4">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Account Login
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Sign in with your account credentials
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Email
            </label>
            <Input
              autoFocus
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
          </div>

          <Button
            disabled={!email || !password || loading}
            onClick={handleSubmit}
            className="mt-1 w-full"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Sign In'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
