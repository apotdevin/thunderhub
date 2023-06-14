import { useEffect, useMemo, useState } from 'react';
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
  VisibilityState,
} from '@tanstack/react-table';
import { Settings, X } from 'react-feather';
import { Input } from '../input';
import { separationColor } from '../../../src/styles/Themes';
import { ColorButton } from '../buttons/colorButton/ColorButton';
import { mediaWidths } from '../../../src/styles/Themes';
import { groupBy } from 'lodash';
import { DarkSubTitle, SubCard } from '../generic/Styled';

interface TableV2Props {
  columns: ColumnDef<any, any>[];
  data: any;
  filterPlaceholder: string;
  withBorder?: boolean;
  alignCenter?: boolean;
  fontSize?: string;
  defaultHiddenColumns?: VisibilityState;
  onHideToggle?: (hide: boolean, id: string) => void;
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
  optionRow: styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: wrap;

    @media (${mediaWidths.mobile}) {
      display: block;
    }
  `,
  option: styled.label`
    margin: 4px 8px;
  `,
  options: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;

    @media (${mediaWidths.mobile}) {
      flex-direction: row;
    }
  `,
  wrapper: styled.div`
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
  `,
};

export default function TableV2({
  columns,
  data,
  filterPlaceholder,
  withBorder,
  alignCenter,
  fontSize,
  defaultHiddenColumns,
  onHideToggle,
}: TableV2Props) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultHiddenColumns || {}
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      globalFilter,
      sorting,
    },
    enableSorting: true,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // The columns that are hideable in configurations need to be grouped by their parents id in order for display purposes
  const groupedHideableColumns = useMemo(() => {
    const allLeafColumns = table
      .getAllLeafColumns()
      .filter(c => c.getCanHide());
    const grouped = groupBy(allLeafColumns, (c: any) => c?.parent?.id);
    return grouped;
  }, [table]);

  return (
    <>
      <S.row>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder={filterPlaceholder}
          count={table.getFilteredRowModel().rows.length}
        />
        {onHideToggle ? (
          <ColorButton onClick={() => setIsOpen(p => !p)}>
            {isOpen ? <X size={18} /> : <Settings size={18} />}
          </ColorButton>
        ) : null}
      </S.row>

      {isOpen ? (
        <S.optionRow>
          {Object.keys(groupedHideableColumns).map(
            (group: string, index: number) => {
              return (
                <SubCard key={`${group}-${index}`} style={{ height: 'auto' }}>
                  <DarkSubTitle fontSize="16px">
                    {group === 'undefined' ? 'General' : group}
                  </DarkSubTitle>
                  <S.options>
                    {groupedHideableColumns[group].map((column: any) => {
                      return (
                        <S.option key={column.id} className="px-1">
                          <label>
                            <input
                              {...{
                                type: 'checkbox',
                                checked: column.getIsVisible(),
                                onChange: column.getToggleVisibilityHandler(),
                              }}
                            />{' '}
                            {column.columnDef.header}
                          </label>
                        </S.option>
                      );
                    })}
                  </S.options>
                </SubCard>
              );
            }
          )}
        </S.optionRow>
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
