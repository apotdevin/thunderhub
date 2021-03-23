import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  useTable,
  useSortBy,
  useAsyncDebounce,
  useGlobalFilter,
} from 'react-table';
import { separationColor } from 'src/styles/Themes';
import { Input } from '../input';

type StyledTableProps = {
  withBorder?: boolean;
  alignCenter?: boolean;
  fontSize?: string;
};

const Styles = styled.div`
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
      font-size: ${({ fontSize }: StyledTableProps) => fontSize || '14px'};
      text-align: left;
      margin: 0;
      padding: 8px;
      ${({ withBorder }: StyledTableProps) =>
        withBorder &&
        css`
          border-bottom: 1px solid ${separationColor};
        `}
      ${({ alignCenter }: StyledTableProps) =>
        alignCenter &&
        css`
          text-align: center;
          padding: 8px;
        `}
      :last-child {
        border-right: 0;
      }
    }
  }
`;

const FilterLine = styled.div`
  margin-bottom: 24px;
`;

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  filterPlaceholder,
}: any) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <FilterLine>
      <Input
        maxWidth={'300px'}
        value={value || ''}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search ${count} ${filterPlaceholder || ''}`}
      />
    </FilterLine>
  );
};

type TableProps = {
  tableData: any[];
  tableColumns:
    | { Header: string; accessor: string }[]
    | { Header: string; columns: { Header: string; accessor: string }[] }[];
  withBorder?: boolean;
  fontSize?: string;
  filterPlaceholder?: string;
  notSortable?: boolean;
  alignCenter?: boolean;
};

export const Table: React.FC<TableProps> = ({
  tableData,
  tableColumns,
  withBorder,
  fontSize,
  filterPlaceholder,
  notSortable,
  alignCenter,
}) => {
  const data = useMemo(() => tableData, [tableData]);
  const columns = useMemo(() => tableColumns, [tableColumns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );

  return (
    <>
      {!!filterPlaceholder && (
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
          filterPlaceholder={filterPlaceholder}
        />
      )}
      <Styles
        withBorder={withBorder}
        fontSize={fontSize}
        alignCenter={alignCenter}
      >
        <table {...getTableProps()} style={{ width: '100%' }}>
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(
                      notSortable ? undefined : column.getSortByToggleProps()
                    )}
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
    </>
  );
};
