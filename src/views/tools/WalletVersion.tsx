import * as React from 'react';
import { useGetWalletInfoQuery } from 'src/graphql/queries/__generated__/getWalletInfo.generated';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
  Separation,
} from '../../components/generic/Styled';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { renderLine } from '../../components/generic/helpers';

export const WalletVersion = () => {
  const { data, loading, error } = useGetWalletInfoQuery({
    ssr: false,
  });

  const getStatus = (status: boolean) => (status ? 'Enabled' : 'Disabled');

  if (error) {
    return null;
  }

  const renderContent = () => {
    if (loading || !data?.getWalletInfo) {
      return <LoadingCard />;
    }

    const {
      build_tags,
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
        {renderLine('Build Tags:', build_tags.join(', '))}
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
