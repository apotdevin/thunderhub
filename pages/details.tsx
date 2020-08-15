import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useTable, useSortBy, useRowSelect } from 'react-table';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { useChannelFeesQuery } from 'src/graphql/queries/__generated__/getChannelFees.generated';
import { getErrorContent } from 'src/utils/error';
import { toast } from 'react-toastify';
import { Card, CardWithTitle, SubTitle } from 'src/components/generic/Styled';
import styled from 'styled-components';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { separationColor, mediaWidths } from 'src/styles/Themes';
import { GET_CHANNELS } from 'src/graphql/queries/getChannels';
import { Upload, X } from 'react-feather';
import { saveToPc } from 'src/utils/helpers';
import { DetailsUpload } from 'src/components/details/detailsUpload';

const ToastStyle = styled.div`
  width: 100%;
  text-align: center;
`;

export const IconCursor = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 8px;
`;

const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const IndeterminateCheckbox = React.forwardRef<
  HTMLButtonElement,
  { indeterminate: any }
>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

const Styles = styled.div`
  padding: 8px;
  overflow-x: auto;
  table {
    border-spacing: 0;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      font-size: 14px;
      text-align: center;
      margin: 0;
      padding: 4px;
      border-right: 1px solid ${separationColor};
      :last-child {
        border-right: 0;
      }
    }
  }
`;

const Detail = () => {
  const [willUpload, setWillUpload] = useState<boolean>(false);
  const toastId = useRef<any>(null);

  const { loading, data } = useChannelFeesQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const table = useMemo(() => {
    if (loading || !data?.getChannels?.length) return [];

    const newTable: any =
      data.getChannels.map(channel => {
        const policies =
          channel?.partner_fee_info?.channel?.node_policies || {};
        return {
          id: channel?.id,
          alias: channel?.partner_node_info.node.alias,
          transaction_id: channel?.transaction_id,
          transaction_vout: channel?.transaction_vout,
          ...policies,
          base_fee_mtokens: Number(policies.base_fee_mtokens) / 1000,
          max_htlc_mtokens: Number(policies.max_htlc_mtokens) / 1000,
          min_htlc_mtokens: Number(policies.min_htlc_mtokens) / 1000,
        };
      }) || [];
    return newTable;
  }, [loading, data]);

  const columns: any = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'alias',
      },
      {
        Header: 'Fee Rate',
        accessor: 'fee_rate',
      },
      {
        Header: 'Base Fee',
        accessor: 'base_fee_mtokens',
      },
      {
        Header: 'CLTV Delta',
        accessor: 'cltv_delta',
      },
      {
        Header: 'Max HTLC',
        accessor: 'max_htlc_mtokens',
      },
      {
        Header: 'Min HTLC',
        accessor: 'min_htlc_mtokens',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  } = useTable({ columns, data: table }, useSortBy, useRowSelect, hooks => {
    hooks.visibleColumns.push(columns => {
      const Header = ({ getToggleAllRowsSelectedProps }: any) => (
        <div>
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        </div>
      );

      const Cell = ({ row }: any) => (
        <div>
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </div>
      );

      const extra = {
        id: 'selection',
        Header,
        Cell,
      };

      return [...columns, extra];
    });
  });

  const ids = Object.keys(selectedRowIds);
  // const selectedChannels = ids.map((id: string) => table[Number(id)]);

  // console.log({ ids, selectedChannels, table });

  useEffect(() => {
    if (!toast.isActive(toastId.current) && ids.length) {
      toastId.current = toast.info(
        <ToastStyle>
          {`Download Channel Details`}
          <div>{`(${ids.length} Channels)`}</div>
        </ToastStyle>,
        {
          position: 'bottom-right',
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
          onClick: () =>
            saveToPc(
              JSON.stringify(ids.map((id: string) => table[Number(id)])),
              'channelDetails',
              false,
              true
            ),
        }
      );
    }
    if (toast.isActive(toastId.current) && ids.length) {
      toast.update(toastId.current, {
        render: (
          <ToastStyle>
            {`Download Channel Details`}
            <div>{`(${ids.length} Channels)`}</div>
          </ToastStyle>
        ),
        onClick: () =>
          saveToPc(
            JSON.stringify(ids.map((id: string) => table[Number(id)])),
            'channelDetails',
            false,
            true
          ),
      });
    }
    if (!ids.length) {
      toast.dismiss(toastId.current);
    }
  }, [ids, table]);

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  if (loading || !data?.getChannels?.length) {
    return <LoadingCard title={'Channel Details'} />;
  }

  return (
    <CardWithTitle>
      <CardTitleRow>
        <SubTitle>Channel Details</SubTitle>
        <IconCursor onClick={() => setWillUpload(p => !p)}>
          {willUpload ? <X size={16} /> : <Upload size={16} />}
        </IconCursor>
      </CardTitleRow>
      {willUpload && (
        <Card>
          <DetailsUpload />
        </Card>
      )}
      <Card cardPadding={'0'}>
        <Styles>
          <table {...getTableProps()} style={{ width: '100%' }}>
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column: any, index) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={index}
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? '⬇'
                            : '⬆'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => {
                      return (
                        <td {...cell.getCellProps()} key={index}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Styles>
      </Card>
    </CardWithTitle>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <Detail />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context, [GET_CHANNELS]);
}
