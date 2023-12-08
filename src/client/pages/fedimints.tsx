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
import { X } from 'react-feather';
import { AddMint } from '../src/views/fedimints/AddMint';
import Table from '../src/components/table';
import { useGatewayFederations } from '../src/hooks/UseGatewayFederations';
import { Federation } from '../src/api/types';
import { CellContext } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import { Price } from '../src/components/price/Price';

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
        header: 'Balance',
        accessorKey: 'balance_msat',
        cell: (props: CellContext<Federation, any>) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Price amount={props.row.original.balance_msat / 1000} />
          </div>
        ),
      },
      {
        header: 'Suported Modules',
        accessorKey: 'modules',
        cell: (props: CellContext<Federation, any>) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {Object.values(props.row.original.config.modules)
              .map(module => module.kind)
              .join(', ')}
          </div>
        ),
      },
      {
        header: 'Leave',
        accessorKey: 'leave',
        cell: (props: CellContext<Federation, any>) => (
          <div
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (props.row.original.balance_msat > 0) {
                toast.error("Can't leave a federation you've got sats in!");
              } else {
                toast.warn('Not implemented yet!');
              }
            }}
          >
            <X />
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
