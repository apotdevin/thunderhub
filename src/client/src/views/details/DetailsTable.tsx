import React, { useMemo, useRef, useEffect } from 'react';
import { useTable, useSortBy, useRowSelect } from 'react-table';
import { separationColor } from '../../styles/Themes';
import { saveToPc } from '../../utils/helpers';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { ChannelFeesQuery } from '../../graphql/queries/__generated__/getChannelFees.generated';

const ToastStyle = styled.div`
  width: 100%;
  text-align: center;
`;

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

type DetailsTableType = {
  channels: ChannelFeesQuery['getChannels'];
};

export const DetailsTable = ({ channels }: DetailsTableType) => {
  const toastId = useRef<any>(null);

  const table = useMemo(() => {
    if (!channels?.length) return [];

    return (
      channels.map(channel => {
        const policies = channel?.partner_fee_info?.node_policies;
        let finalPolicies = {};
        if (policies) {
          finalPolicies = {
            fee_rate: policies.fee_rate,
            cltv_delta: policies.cltv_delta,
            base_fee_tokens: Number(policies.base_fee_mtokens) / 1000,
            max_htlc_tokens: Number(policies.max_htlc_mtokens) / 1000,
            min_htlc_tokens: Number(policies.min_htlc_mtokens) / 1000,
          };
        }
        return {
          id: channel?.id,
          alias: channel?.partner_node_info.node.alias,
          transaction_id: channel?.transaction_id,
          transaction_vout: channel?.transaction_vout,
          ...finalPolicies,
        };
      }) || []
    );
  }, [channels]);

  const columns: any = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'alias',
      },
      {
        Header: 'Fee Rate (ppm)',
        accessor: 'fee_rate',
      },
      {
        Header: 'Base Fee (sat)',
        accessor: 'base_fee_tokens',
      },
      {
        Header: 'CLTV Delta',
        accessor: 'cltv_delta',
      },
      {
        Header: 'Max HTLC (sat)',
        accessor: 'max_htlc_tokens',
      },
      {
        Header: 'Min HTLC (sat)',
        accessor: 'min_htlc_tokens',
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

  useEffect(() => {
    if (!toast.isActive(toastId.current) && ids.length) {
      toastId.current = toast.info(
        <ToastStyle>
          {`Download Details`}
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
            {`Download Details`}
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

  return (
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
                    {column.isSorted ? (column.isSortedDesc ? '⬇' : '⬆') : ''}
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
  );
};
