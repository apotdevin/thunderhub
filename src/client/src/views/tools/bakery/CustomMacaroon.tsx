import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Copy, Loader2 } from 'lucide-react';
import { useCreateMacaroonMutation } from '../../../graphql/mutations/__generated__/createMacaroon.generated';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../utils/error';
import { useMutationResultWithReset } from '../../../hooks/UseMutationWithReset';
import Modal from '../../../components/modal/ReactModal';
import { shorten } from '../../../components/generic/helpers';
import { NetworkInfoInput } from '../../../graphql/types';

const InitPermissions = {
  is_ok_to_adjust_peers: false,
  is_ok_to_create_chain_addresses: false,
  is_ok_to_create_invoices: false,
  is_ok_to_create_macaroons: false,
  is_ok_to_derive_keys: false,
  is_ok_to_get_access_ids: false,
  is_ok_to_get_chain_transactions: false,
  is_ok_to_get_invoices: false,
  is_ok_to_get_wallet_info: false,
  is_ok_to_get_payments: false,
  is_ok_to_get_peers: false,
  is_ok_to_pay: false,
  is_ok_to_revoke_access_ids: false,
  is_ok_to_send_to_chain_addresses: false,
  is_ok_to_sign_bytes: false,
  is_ok_to_sign_messages: false,
  is_ok_to_stop_daemon: false,
  is_ok_to_verify_bytes_signatures: false,
  is_ok_to_verify_messages: false,
};

const permissionLabels: Record<keyof typeof InitPermissions, string> = {
  is_ok_to_adjust_peers: 'Adjust Peers',
  is_ok_to_create_chain_addresses: 'Create Chain Addresses',
  is_ok_to_create_invoices: 'Create Invoices',
  is_ok_to_create_macaroons: 'Create Macaroons',
  is_ok_to_derive_keys: 'Derive Keys',
  is_ok_to_get_access_ids: 'Get Access Keys',
  is_ok_to_get_chain_transactions: 'Get Chain Transactions',
  is_ok_to_get_invoices: 'Get Invoices',
  is_ok_to_get_wallet_info: 'Get Wallet Info',
  is_ok_to_get_payments: 'Get Payments',
  is_ok_to_get_peers: 'Get Peers',
  is_ok_to_pay: 'Pay Invoices',
  is_ok_to_revoke_access_ids: 'Revoke Access IDs',
  is_ok_to_send_to_chain_addresses: 'Send to Chain Addresses',
  is_ok_to_sign_bytes: 'Sign Bytes',
  is_ok_to_sign_messages: 'Sign Messages',
  is_ok_to_stop_daemon: 'Stop Daemon',
  is_ok_to_verify_bytes_signatures: 'Verify Bytes Signatures',
  is_ok_to_verify_messages: 'Verify Messages',
};

export const CustomMacaroon = () => {
  const [newMacaroon, setNewMacaroon] = useState(false);
  const [permissions, setPermissions] =
    useState<NetworkInfoInput>(InitPermissions);

  const hasAnyPermission = Object.values(permissions).some(Boolean);

  const [bake, { loading, data: _data }] = useCreateMacaroonMutation({
    onCompleted: () => setNewMacaroon(true),
    onError: error => toast.error(getErrorContent(error)),
  });

  const [data, resetMutationResult] = useMutationResultWithReset(_data);

  const closeCallback = () => {
    setNewMacaroon(false);
    setPermissions(InitPermissions);
    resetMutationResult();
  };

  return (
    <>
      <div className="space-y-4">
        <div className="border-b border-border pb-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Permissions
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-3">
            {(
              Object.keys(permissionLabels) as Array<
                keyof typeof InitPermissions
              >
            ).map(key => (
              <label
                key={key}
                className="flex items-center justify-between gap-2 py-1 cursor-pointer"
              >
                <span
                  className={`text-sm ${permissions[key] ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                >
                  {permissionLabels[key]}
                </span>
                <Switch
                  checked={!!permissions[key]}
                  onCheckedChange={v =>
                    setPermissions(p => ({ ...p, [key]: v }))
                  }
                />
              </label>
            ))}
          </div>
        </div>
        <Button
          className="w-full"
          onClick={() => bake({ variables: { permissions } })}
          disabled={loading || !hasAnyPermission}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            'Bake Macaroon'
          )}
        </Button>
      </div>

      <Modal
        isOpen={!!newMacaroon}
        closeCallback={closeCallback}
        title="New Macaroon"
      >
        {data?.createMacaroon && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">New Macaroon</h3>

            <div className="space-y-3">
              <div className="rounded border border-border bg-muted/50 p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Base64 Encoded
                </p>
                <p className="text-sm font-mono break-all">
                  {shorten(data.createMacaroon.base)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(data.createMacaroon!.base)
                      .then(() => toast.success('Macaroon Copied'))
                  }
                >
                  <Copy size={14} />
                  Copy
                </Button>
              </div>

              <div className="rounded border border-border bg-muted/50 p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Hex Encoded
                </p>
                <p className="text-sm font-mono break-all">
                  {shorten(data.createMacaroon.hex)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(data.createMacaroon!.hex)
                      .then(() => toast.success('Macaroon Copied'))
                  }
                >
                  <Copy size={14} />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
