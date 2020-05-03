import * as React from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
  Separation,
} from '../../components/generic/Styled';
import { useGetWalletInfoQuery } from '../../generated/graphql';
import { useAccount } from '../../context/AccountContext';
import { useStatusState } from '../../context/StatusContext';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { renderLine } from '../../components/generic/helpers';

export const WalletVersion = () => {
  const { minorVersion } = useStatusState();
  const { auth } = useAccount();
  const { data, loading, error } = useGetWalletInfoQuery({
    skip: minorVersion < 10,
    variables: { auth },
  });

  const getStatus = (status: boolean) => (status ? 'Enabled' : 'Disabled');

  if (error) {
    return null;
  }

  const renderContent = () => {
    if (minorVersion < 10) {
      return (
        <Card>
          Update to LND version 0.10.0 or higher to see your wallet build info.
        </Card>
      );
    }

    if (loading || !data?.getWalletInfo) {
      return <LoadingCard />;
    }

    const {
      is_autopilotrpc_enabled,
      is_chainrpc_enabled,
      is_invoicesrpc_enabled,
      is_signrpc_enabled,
      is_walletrpc_enabled,
      is_watchtowerrpc_enabled,
      is_wtclientrpc_enabled,
      commit_hash,
    } = data.getWalletInfo;

    return (
      <Card>
        {renderLine('Commit hash:', commit_hash)}
        <Separation />
        <Sub4Title>
          <b>RPC</b>
        </Sub4Title>
        {renderLine('Autopilot:', getStatus(is_autopilotrpc_enabled))}
        {renderLine('Chain:', getStatus(is_chainrpc_enabled))}
        {renderLine('Invoices:', getStatus(is_invoicesrpc_enabled))}
        {renderLine('Signer:', getStatus(is_signrpc_enabled))}
        {renderLine('Wallet:', getStatus(is_walletrpc_enabled))}
        {renderLine('Watchtower:', getStatus(is_watchtowerrpc_enabled))}
        {renderLine('WTClient:', getStatus(is_wtclientrpc_enabled))}
      </Card>
    );
  };

  return (
    <CardWithTitle>
      <SubTitle>Wallet Version</SubTitle>
      {renderContent()}
    </CardWithTitle>
  );
};
