import { Table } from '@tanstack/react-table';
import { FC, useMemo } from 'react';
import { groupBy } from 'lodash';
import { Checkbox } from '@/components/ui/checkbox';

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

  const groupLabel = (groupId: string): string => {
    if (groupId === 'undefined') return 'General';
    const col = table.getColumn(groupId);
    const header = col?.columnDef?.header;
    return typeof header === 'string' ? header : groupId;
  };

  return (
    <div className="flex flex-wrap gap-4 rounded border border-border p-3">
      {Object.keys(groupedHideableColumns).map(
        (group: string, index: number) => (
          <div key={`${group}-${index}`} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {groupLabel(group)}
            </span>
            <div className="flex flex-col gap-1">
              {groupedHideableColumns[group].map((column: any) => {
                const label =
                  typeof column.columnDef.header === 'string'
                    ? column.columnDef.header
                    : column.id;
                return (
                  <label
                    key={column.id}
                    className="flex cursor-pointer items-center gap-2 text-xs"
                  >
                    <Checkbox
                      checked={column.getIsVisible()}
                      onCheckedChange={checked => {
                        column.getToggleVisibilityHandler()({
                          target: { checked },
                        });
                        toggleConfiguration(!checked, column.id);
                      }}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};
