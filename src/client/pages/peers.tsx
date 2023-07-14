import React, { useMemo } from 'react';
import { useGetPeersQuery } from '../src/graphql/queries/__generated__/getPeers.generated';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import {
  CardWithTitle,
  SubTitle,
  Card,
  DarkSubTitle,
} from '../src/components/generic/Styled';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { AddPeer } from '../src/views/peers/AddPeer';
import { copyLink, getNodeLink } from '../src/components/generic/helpers';
import { Price } from '../src/components/price/Price';
import Table from '../src/components/table';

const PeersView = () => {
  const { loading, data } = useGetPeersQuery();

  const tableData = useMemo(() => {
    const channelData = data?.getPeers || [];

    return channelData.map(c => {
      return {
        ...c,
        alias: c.partner_node_info.node?.alias || 'Unknown',
      };
    });
  }, [data]);

  const columns = useMemo(
    () => [
      {
        header: 'Peer',
        accessorKey: 'alias',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {getNodeLink(row.original.public_key, row.original.alias)}
          </div>
        ),
      },
      {
        header: 'Sync Peer',
        accessorKey: 'is_sync_peer',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {row.original.is_sync_peer ? 'Yes' : '-'}
          </div>
        ),
      },
      {
        header: 'Socket',
        accessorKey: 'socket',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {row.original.socket.includes('.onion') ? 'Tor' : 'Clearnet'}
            {copyLink(row.original.socket)}
          </div>
        ),
      },
      {
        header: 'Ping',
        accessorKey: 'ping_time',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {`${row.original.ping_time} ms`}
          </div>
        ),
      },
      {
        header: 'Sats Received',
        accessorKey: 'tokens_received',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.tokens_received} />
          </div>
        ),
      },
      {
        header: 'Sats Sent',
        accessorKey: 'tokens_sent',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={row.original.tokens_sent} />
          </div>
        ),
      },
      {
        header: 'Bytes Received',
        accessorKey: 'bytes_received',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {`${Math.round(row.original.bytes_received * 0.0001) / 100} MB`}
          </div>
        ),
      },
      {
        header: 'Bytes Sent',
        accessorKey: 'bytes_sent',
        cell: ({ row }: any) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {`${Math.round(row.original.bytes_sent * 0.0001) / 100} MB`}
          </div>
        ),
      },
    ],
    []
  );

  if (loading) {
    return (
      <Card mobileNoBackground={true}>
        <LoadingCard noCard={true} />
      </Card>
    );
  }

  if (!data || !data.getPeers?.length) {
    return (
      <Card mobileNoBackground={true}>
        <DarkSubTitle>No peers found</DarkSubTitle>
      </Card>
    );
  }

  return (
    <CardWithTitle>
      <SubTitle>Peers</SubTitle>
      <Card mobileNoBackground={true}>
        <Table
          withBorder={true}
          columns={columns}
          data={tableData}
          withSorting={true}
          withGlobalSort={true}
          filterPlaceholder="peers"
        />
      </Card>
    </CardWithTitle>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <AddPeer />
    <PeersView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
