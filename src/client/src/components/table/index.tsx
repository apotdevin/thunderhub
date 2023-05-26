import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  useTable,
  useSortBy,
  useAsyncDebounce,
  useGlobalFilter,
  TableInstance,
  useFilters,
  ColumnInstance,
} from 'react-table';
import { mediaWidths, separationColor } from '../../../src/styles/Themes';
import { Input } from '../input';
import { Settings, X } from 'react-feather';
import { ColorButton } from '../buttons/colorButton/ColorButton';
import { DarkSubTitle, SubCard } from '../generic/Styled';
import { groupBy } from 'lodash';
import 'regenerator-runtime/runtime';

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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;

    @media (${mediaWidths.mobile}) {
      flex-direction: row;
    }
  `,
  option: styled.label`
    margin: 4px 8px;
  `,
  row: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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
  Header: string | JSX.Element;
  accessor: string;
};

type TableProps = {
  tableData: any[];
  tableColumns: (
    | TableColumn
    | {
        Header: string | JSX.Element;
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

  const orderedColumns = useMemo(() => {
    const hidableColumns = allColumns.reduce((p, c) => {
      if (c.isVisible && (c as any).forceVisible) {
        return p;
      }

      return [...p, c];
    }, [] as ColumnInstance[]);

    const grouped = groupBy(
      hidableColumns,
      (c: any) => c?.parent?.Header || ''
    );

    const final = [];

    for (const key in grouped) {
      if (Object.prototype.hasOwnProperty.call(grouped, key)) {
        const group = grouped[key];
        final.push({ name: key, items: group });
      }
    }

    return final;
  }, [allColumns]);

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
        <S.optionRow>
          {orderedColumns.map((column, index) => {
            const { name, items } = column;

            return (
              <SubCard key={`${name}${index}`} style={{ height: 'auto' }}>
                <DarkSubTitle fontSize="16px">{name || 'General'}</DarkSubTitle>
                <S.options>
                  {items.map(item => {
                    const { checked } = item.getToggleHiddenProps();

                    return (
                      <S.option key={item.id}>
                        <label>
                          <input
                            onClick={() =>
                              onHideToggle && onHideToggle(checked, item.id)
                            }
                            type={'checkbox'}
                            {...item.getToggleHiddenProps()}
                          />
                          {item.Header as any}
                        </label>
                      </S.option>
                    );
                  })}
                </S.options>
              </SubCard>
            );
          })}
        </S.optionRow>
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
