import { Table } from '@tanstack/react-table';
import { FC, useMemo } from 'react';
import { groupBy } from 'lodash';
import { DarkSubTitle, SubCard } from '../generic/Styled';

interface ColumnConfigurationsProps {
  table: Table<any>;
  toggleConfiguration: (hide: boolean, id: string) => void;
}

export const ColumnConfigurations: FC<ColumnConfigurationsProps> = ({
  table,
  toggleConfiguration,
}: ColumnConfigurationsProps) => {
  const groupedHideableColumns = useMemo(() => {
    const allLeafColumns = table
      .getAllLeafColumns()
      .filter(c => c.getCanHide());
    const grouped = groupBy(allLeafColumns, (c: any) => c?.parent?.id);
    return grouped;
  }, [table]);

  return (
    <div className="flex justify-start items-stretch flex-wrap md:flex md:flex-row">
      {Object.keys(groupedHideableColumns).map(
        (group: string, index: number) => {
          return (
            <SubCard key={`${group}-${index}`} style={{ height: 'auto' }}>
              <DarkSubTitle fontSize="16px">
                {group === 'undefined' ? 'General' : group}
              </DarkSubTitle>
              <div className="flex flex-row md:flex-col justify-start items-start flex-wrap">
                {groupedHideableColumns[group].map((column: any) => {
                  return (
                    <label key={column.id} className="m-1 mx-2">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        onClick={(e: any) =>
                          toggleConfiguration(!e.target.checked, column.id)
                        }
                      />{' '}
                      {column.columnDef.header}
                    </label>
                  );
                })}
              </div>
            </SubCard>
          );
        }
      )}
    </div>
  );
};
