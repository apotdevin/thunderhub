import * as React from 'react';
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
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import {
  SingleButton,
  MultiButton,
} from '../../../components/buttons/multiButton/MultiButton';
import { useCreateMacaroonMutation } from '../../../graphql/mutations/__generated__/createMacaroon.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { useMutationResultWithReset } from '../../../hooks/UseMutationWithReset';
import Modal from '../../../components/modal/ReactModal';
import { shorten } from '../../../components/generic/helpers';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Copy } from 'react-feather';
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
  const [isOpen, isOpenSet] = React.useState<boolean>(false);
  const [newMacaroon, newMacaroonSet] = React.useState<boolean>(false);

  const [permissions, permissionSet] =
    React.useState<NetworkInfoInput>(InitPermissions);

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
          <CopyToClipboard
            text={base}
            onCopy={() => toast.success('Macaroon Copied')}
          >
            <ColorButton>
              <Copy size={18} />
              Copy
            </ColorButton>
          </CopyToClipboard>
        </SingleLine>
        <Separation />
        <SubTitle>Hex Encoded</SubTitle>
        <SingleLine>
          <Sub4Title>{shorten(hex)}</Sub4Title>
          <CopyToClipboard
            text={hex}
            onCopy={() => toast.success('Macaroon Copied')}
          >
            <ColorButton>
              <Copy size={18} />
              Copy
            </ColorButton>
          </CopyToClipboard>
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
      <MultiButton>
        <SingleButton
          selected={permissions[value]}
          onClick={() => permissionSet(p => ({ ...p, [value]: true }))}
        >
          Yes
        </SingleButton>
        <SingleButton
          selected={!permissions[value]}
          onClick={() => permissionSet(p => ({ ...p, [value]: false }))}
        >
          No
        </SingleButton>
      </MultiButton>
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
      <ColorButton
        fullWidth={true}
        withMargin={'16px 0 0'}
        onClick={() => bake({ variables: { permissions } })}
        disabled={loading || !hasATrue}
        loading={loading}
      >
        Bake new macaroon
      </ColorButton>
    </>
  );

  return (
    <>
      <CardWithTitle>
        <SubTitle>Bakery</SubTitle>
        <Card>
          <SingleLine>
            <DarkSubTitle>Macaroon</DarkSubTitle>
            <ColorButton onClick={() => isOpenSet(o => !o)} arrow={!isOpen}>
              {isOpen ? 'Cancel' : 'Bake'}
            </ColorButton>
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
