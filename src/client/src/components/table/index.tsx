import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  useTable,
  useSortBy,
  useAsyncDebounce,
  useGlobalFilter,
  TableInstance,
  useFilters,
} from 'react-table';
import { separationColor } from '../../../src/styles/Themes';
import { Input } from '../input';
import { Settings, X } from 'react-feather';
import { ColorButton } from '../buttons/colorButton/ColorButton';
import { SubCard } from '../generic/Styled';

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

const S = {
  options: styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  `,
  option: styled.label`
    margin: 4px 8px;
  `,
  row: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  `,
};

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

type TableColumn = {
  Header: string;
  accessor: string;
};

type TableProps = {
  tableData: any[];
  tableColumns: (
    | TableColumn
    | {
        Header: string;
        columns: TableColumn[];
      }
  )[];
  withBorder?: boolean;
  fontSize?: string;
  filterPlaceholder?: string;
  notSortable?: boolean;
  alignCenter?: boolean;
  defaultHiddenColumns?: string[];
  onHideToggle?: (hide: boolean, id: string) => void;
};

export const Table: React.FC<TableProps> = ({
  onHideToggle,
  defaultHiddenColumns = [],
  tableData,
  tableColumns,
  withBorder,
  fontSize,
  filterPlaceholder,
  notSortable,
  alignCenter,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const data = useMemo(() => tableData, [tableData]);
  const columns = useMemo(() => tableColumns, [tableColumns]);
  const hiddenColumns = useMemo(
    () => defaultHiddenColumns,
    [defaultHiddenColumns]
  );

  const instance = useTable(
    {
      autoResetSortBy: false,
      columns,
      data,
      initialState: {
        hiddenColumns,
      },
    } as any,
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const {
    allColumns,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = instance as TableInstance & {
    preGlobalFilteredRows: any;
    setGlobalFilter: any;
  };

  const hidableColumns = allColumns.filter(c => {
    if (!c.isVisible) {
      return true;
    }
    return !(c as any).forceVisible;
  });

  return (
    <>
      {filterPlaceholder || onHideToggle ? (
        <S.row>
          {filterPlaceholder ? (
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={(state as any).globalFilter}
              setGlobalFilter={setGlobalFilter}
              filterPlaceholder={filterPlaceholder}
            />
          ) : null}
          {onHideToggle ? (
            <ColorButton onClick={() => setIsOpen(p => !p)}>
              {isOpen ? <X size={18} /> : <Settings size={18} />}
            </ColorButton>
          ) : null}
        </S.row>
      ) : null}
      {isOpen && (
        <SubCard>
          <S.options>
            {hidableColumns.map(column => {
              const parent = column?.parent?.Header || '';
              const title = parent
                ? `${parent} - ${column.Header}`
                : column.Header;
              const { checked } = column.getToggleHiddenProps();

              return (
                <S.option key={column.id}>
                  <label>
                    <input
                      onClick={() =>
                        onHideToggle && onHideToggle(checked, column.id)
                      }
                      type={'checkbox'}
                      {...column.getToggleHiddenProps()}
                    />
                    {title}
                  </label>
                </S.option>
              );
            })}
          </S.options>
        </SubCard>
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
                {headerGroup.headers.map((column: any, index) => (
                  <th
                    {...column.getHeaderProps(
                      notSortable ? undefined : column.getSortByToggleProps()
                    )}
                    key={index}
                  >
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {column.render('Header')}
                    </span>
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
