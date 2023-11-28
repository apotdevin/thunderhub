import React, { useMemo } from 'react';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import {
  CardWithTitle,
  SubTitle,
  Card,
  DarkSubTitle,
} from '../src/components/generic/Styled';
import { AddMint } from '../src/views/fedimints/AddMint';
import Table from '../src/components/table';
import { useGatewayFederations } from '../src/hooks/UseGatewayFederations';
import { Federation } from '../src/api/types';
import { CellContext } from '@tanstack/react-table';

const FedimintsView = () => {
  const federations = useGatewayFederations();

  const tableData = useMemo(() => {
    const federationData = federations || [];

    return federationData.map(f => {
      return {
        ...f,
        alias: f.federation_id,
      };
    });
  }, [federations]);

  const columns = useMemo(
    () => [
      {
        header: 'Federation Name',
        accessorKey: 'federation_name',
        cell: (props: CellContext<Federation, any>) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {props.row.original.config.meta.federation_name || '-'}
          </div>
        ),
      },
      {
        header: 'Federation ID',
        accessorKey: 'federation_id',
        cell: (props: CellContext<Federation, any>) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {`${props.row.original.federation_id.slice(
              0,
              6
            )}...${props.row.original.federation_id.slice(-6)}`}
          </div>
        ),
      },
      {
        header: 'Balance (msat)',
        accessorKey: 'balance_msat',
        cell: (props: CellContext<Federation, any>) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {props.row.original.balance_msat}
          </div>
        ),
      },
      {
        header: 'Consensus Version',
        accessorKey: 'consensus_version',
        cell: (props: CellContext<Federation, any>) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {props.row.original.config.consensus_version.major +
              '.' +
              props.row.original.config.consensus_version.minor}
          </div>
        ),
      },
    ],
    []
  );

  if (!federations || !federations?.length) {
    return (
      <Card mobileNoBackground={true}>
        <DarkSubTitle>No Connected Federations!</DarkSubTitle>
      </Card>
    );
  }

  return (
    <CardWithTitle>
      <SubTitle>Fedimints</SubTitle>
      <Card mobileNoBackground={true}>
        <Table
          withBorder={true}
          columns={columns}
          data={tableData}
          withSorting={true}
          withGlobalSort={true}
          filterPlaceholder={
            federations.length > 1 ? 'federations' : 'federation'
          }
        />
      </Card>
    </CardWithTitle>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <AddMint />
    <FedimintsView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
