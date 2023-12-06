import { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { Settings, X } from 'react-feather';
import { separationColor } from '../../styles/Themes';
import { ColorButton } from '../buttons/colorButton/ColorButton';
import { ColumnConfigurations } from './ColumnConfigurations';
import { DebouncedInput } from './DebouncedInput';

interface TableProps {
  columns: ColumnDef<any, any>[];
  data: any;
  filterPlaceholder?: string;
  withGlobalSort?: boolean; // enables the global search box
  withSorting?: boolean; // enables columns to be sorted
  initSorting?: SortingState;
  withBorder?: boolean;
  alignCenter?: boolean;
  fontSize?: string;
  defaultHiddenColumns?: VisibilityState;
  toggleConfiguration?: (hide: boolean, id: string) => void;
}

type StyledTableProps = {
  withBorder?: boolean;
  alignCenter?: boolean;
  fontSize?: string;
};

const S = {
  row: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 24px;
  `,
  wrapper: styled.div<StyledTableProps>`
    overflow-x: auto;
    table {
      width: 100%;
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

      th,
      td {
        font-size: ${({ fontSize }) => fontSize || '14px'};
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
  `,
};

export default function Table({
  columns,
  data,
  filterPlaceholder,
  withBorder,
  alignCenter,
  fontSize,
  defaultHiddenColumns,
  toggleConfiguration,
  withGlobalSort = false,
  withSorting = false,
  initSorting,
}: TableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>(initSorting || []);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultHiddenColumns || {}
  );

  const tableConfigs = {
    data,
    columns,
    state: {
      columnVisibility,
      globalFilter,
      sorting,
    },
    enableSorting: withSorting,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  };

  if (withGlobalSort) {
    tableConfigs.enableSorting = true;
    tableConfigs.state.globalFilter = globalFilter;
    tableConfigs.onGlobalFilterChange = setGlobalFilter;
  }

  if (withSorting) {
    tableConfigs.state.sorting = sorting;
    tableConfigs.onSortingChange = setSorting;
  }

  const table = useReactTable(tableConfigs);

  return (
    <>
      <S.row>
        {withGlobalSort ? (
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder={filterPlaceholder || ''}
            count={table.getFilteredRowModel().rows.length}
          />
        ) : null}
        {toggleConfiguration ? (
          <>
            <ColorButton onClick={() => setIsOpen(p => !p)}>
              {isOpen ? <X size={18} /> : <Settings size={18} />}
            </ColorButton>
          </>
        ) : null}
      </S.row>

      {isOpen && toggleConfiguration ? (
        <ColumnConfigurations
          table={table}
          toggleConfiguration={toggleConfiguration}
        />
      ) : null}

      <S.wrapper
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
      </S.wrapper>
    </>
  );
}
