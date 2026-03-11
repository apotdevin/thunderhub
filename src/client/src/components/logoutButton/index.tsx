import { useEffect } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { useLogoutMutation } from '@/graphql/mutations/__generated__/logout.generated';
import { useApolloClient } from '@apollo/client';
import { config } from '../../config/thunderhubConfig';
import { safeRedirect } from '../../utils/url';
import { Button, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

interface LogoutButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  label?: string;
}

export const LogoutButton = ({
  variant = 'ghost',
  size = 'icon-sm',
  className,
  label,
}: LogoutButtonProps) => {
  const client = useApolloClient();
  const [logout, { data, loading }] = useLogoutMutation({
    refetchQueries: ['GetServerAccounts'],
  });

  useEffect(() => {
    if (data && data.logout) {
      client.clearStore();
      safeRedirect(
        config.logoutUrl || `${config.basePath}/login`,
        `${config.basePath}/login`
      );
    }
  }, [data, client]);

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={() => !loading && logout()}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <LogOut size={18} />
      )}
      {label && <span>{label}</span>}
    </Button>
  );
};
