import { useState } from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  DarkSubTitle,
  SingleLine,
  ResponsiveLine,
  Separation,
  Sub4Title,
} from '../../../components/generic/Styled';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateMacaroonMutation } from '../../../graphql/mutations/__generated__/createMacaroon.generated';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../utils/error';
import { useMutationResultWithReset } from '../../../hooks/UseMutationWithReset';
import Modal from '../../../components/modal/ReactModal';
import { shorten } from '../../../components/generic/helpers';
import { Copy } from 'lucide-react';
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

export const Bakery = () => {
  const [isOpen, isOpenSet] = useState<boolean>(false);
  const [newMacaroon, newMacaroonSet] = useState<boolean>(false);

  const [permissions, permissionSet] =
    useState<NetworkInfoInput>(InitPermissions);

  let hasATrue = false;
  Object.entries(permissions);
  for (const [, value] of Object.entries(permissions)) {
    if (value) {
      hasATrue = true;
    }
  }

  const [bake, { loading, data: _data }] = useCreateMacaroonMutation({
    onCompleted: () => newMacaroonSet(true),
    onError: error => toast.error(getErrorContent(error)),
  });

  const [data, resetMutationResult] = useMutationResultWithReset(_data);

  const resetPermissions = () => permissionSet(InitPermissions);

  const closeCallback = () => {
    newMacaroonSet(false);
    isOpenSet(false);
    resetPermissions();
    resetMutationResult();
  };

  const renderModal = () => {
    if (!data?.createMacaroon) return null;
    const { base, hex } = data.createMacaroon;
    return (
      <>
        <SubTitle>New Macaroon</SubTitle>
        <Separation />
        <SubTitle>Base64 Encoded</SubTitle>
        <SingleLine>
          <Sub4Title>{shorten(base)}</Sub4Title>
          <Button
            variant="outline"
            onClick={() =>
              navigator.clipboard
                .writeText(base)
                .then(() => toast.success('Macaroon Copied'))
            }
          >
            <Copy size={18} />
            Copy
          </Button>
        </SingleLine>
        <Separation />
        <SubTitle>Hex Encoded</SubTitle>
        <SingleLine>
          <Sub4Title>{shorten(hex)}</Sub4Title>
          <Button
            variant="outline"
            onClick={() =>
              navigator.clipboard
                .writeText(hex)
                .then(() => toast.success('Macaroon Copied'))
            }
          >
            <Copy size={18} />
            Copy
          </Button>
        </SingleLine>
      </>
    );
  };

  const renderLine = (title: string, value: keyof NetworkInfoInput) => (
    <ResponsiveLine>
      {permissions[value] ? (
        <Sub4Title>{title}</Sub4Title>
      ) : (
        <DarkSubTitle>{title}</DarkSubTitle>
      )}
      <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
        <Button
          variant={permissions[value] ? 'default' : 'ghost'}
          onClick={() => permissionSet(p => ({ ...p, [value]: true }))}
          className={cn('grow', !permissions[value] && 'text-foreground')}
        >
          Yes
        </Button>
        <Button
          variant={!permissions[value] ? 'default' : 'ghost'}
          onClick={() => permissionSet(p => ({ ...p, [value]: false }))}
          className={cn('grow', permissions[value] && 'text-foreground')}
        >
          No
        </Button>
      </div>
    </ResponsiveLine>
  );

  const renderPermissions = () => (
    <>
      <Separation />
      <Sub4Title>Permissions</Sub4Title>
      {renderLine('Add or remove Peers', 'is_ok_to_adjust_peers')}
      {renderLine('Create Chain Addresses', 'is_ok_to_create_chain_addresses')}
      {renderLine('Create Invoices', 'is_ok_to_create_invoices')}
      {renderLine('Create Macaroons', 'is_ok_to_create_macaroons')}
      {renderLine('Derive Keys', 'is_ok_to_derive_keys')}
      {renderLine('Get Access Keys', 'is_ok_to_get_access_ids')}
      {renderLine('Get Chain Transactions', 'is_ok_to_get_chain_transactions')}
      {renderLine('Get Invoices', 'is_ok_to_get_invoices')}
      {renderLine('Get Wallet Info', 'is_ok_to_get_wallet_info')}
      {renderLine('Get Payments', 'is_ok_to_get_payments')}
      {renderLine('Get Peers', 'is_ok_to_get_peers')}
      {renderLine('Pay Invoices', 'is_ok_to_pay')}
      {renderLine('Revoke Access Ids', 'is_ok_to_revoke_access_ids')}
      {renderLine('Send to Chain Adresses', 'is_ok_to_send_to_chain_addresses')}
      {renderLine('Sign bytes', 'is_ok_to_sign_bytes')}
      {renderLine('Sign Messages', 'is_ok_to_sign_messages')}
      {renderLine('Stop Daemon', 'is_ok_to_stop_daemon')}
      {renderLine('Verify bytes signature', 'is_ok_to_verify_bytes_signatures')}
      {renderLine('Verify messages', 'is_ok_to_verify_messages')}
      <Button
        variant="outline"
        className="w-full"
        style={{ margin: '16px 0 0' }}
        onClick={() => bake({ variables: { permissions } })}
        disabled={loading || !hasATrue}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>Bake new macaroon</>
        )}
      </Button>
    </>
  );

  return (
    <>
      <CardWithTitle>
        <SubTitle>Bakery</SubTitle>
        <Card>
          <SingleLine>
            <DarkSubTitle>Macaroon</DarkSubTitle>
            <Button variant="outline" onClick={() => isOpenSet(o => !o)}>
              {isOpen ? (
                'Cancel'
              ) : (
                <>Bake {!isOpen && <ChevronRight size={18} />}</>
              )}
            </Button>
          </SingleLine>
          {isOpen && renderPermissions()}
        </Card>
      </CardWithTitle>
      <Modal isOpen={!!newMacaroon} closeCallback={closeCallback}>
        {renderModal()}
      </Modal>
    </>
  );
};
