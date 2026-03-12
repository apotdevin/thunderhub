import { useState } from 'react';
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
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColumnConfigurations } from './ColumnConfigurations';
import { DebouncedInput } from './DebouncedInput';
import { cn } from '@/lib/utils';

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
      <div className="flex flex-row justify-between mb-6">
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
            <Button variant="outline" onClick={() => setIsOpen(p => !p)}>
              {isOpen ? <X size={18} /> : <Settings size={18} />}
            </Button>
          </>
        ) : null}
      </div>

      {isOpen && toggleConfiguration ? (
        <ColumnConfigurations
          table={table}
          toggleConfiguration={toggleConfiguration}
        />
      ) : null}

      <div
        className={cn(
          'overflow-x-auto',
          '[&_table]:w-full [&_table]:border-spacing-0',
          '[&_table_tr:last-child_td]:border-b-0',
          '[&_table_.cursor]:cursor-pointer',
          '[&_table_th]:text-left [&_table_th]:m-0 [&_table_th]:p-2',
          '[&_table_td]:text-left [&_table_td]:m-0 [&_table_td]:p-2',
          '[&_table_th:last-child]:border-r-0',
          '[&_table_td:last-child]:border-r-0',
          withBorder &&
            '[&_table_th]:border-b [&_table_th]:border-border [&_table_td]:border-b [&_table_td]:border-border',
          alignCenter && '[&_table_th]:text-center [&_table_td]:text-center'
        )}
        style={{
          fontSize: fontSize || '14px',
        }}
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
      </div>
    </>
  );
}
