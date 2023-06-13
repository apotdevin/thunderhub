import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Input } from '../input';
import { separationColor } from '../../../src/styles/Themes';

interface TableV2Props {
  columns: ColumnDef<any, any>[];
  data: any;
  filterPlaceholder: string;
  withBorder?: boolean;
  alignCenter?: boolean;
  fontSize?: string;
}

const FilterLine = styled.div`
  margin-bottom: 24px;
`;

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
    .cursor {
      cursor: pointer;
    }
    ,
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

export default function TableV2({
  columns,
  data,
  filterPlaceholder,
  withBorder,
  alignCenter,
  fontSize,
}: TableV2Props) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    enableSorting: true,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <FilterLine>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder={filterPlaceholder}
          count={table.getFilteredRowModel().rows.length}
        />
      </FilterLine>

      <Styles
        withBorder={withBorder}
        fontSize={fontSize}
        alignCenter={alignCenter}
      >
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' ⬆',
                              desc: ' ⬇',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder,
  count,
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  count: number;
  debounce?: number;
  placeholder?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      maxWidth={'300px'}
      value={value || ''}
      onChange={e => setValue(e.target.value)}
      placeholder={`Search ${count} ${placeholder || ''}`}
    />
  );
}
