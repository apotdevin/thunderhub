import { Table } from '@tanstack/react-table';
import { FC, useMemo } from 'react';
import styled from 'styled-components';
import { mediaWidths } from '../../styles/Themes';
import { groupBy } from 'lodash';
import { DarkSubTitle, SubCard } from '../generic/Styled';

interface ColumnConfigurationsProps {
  table: Table<any>;
  toggleConfiguration: (hide: boolean, id: string) => void;
}

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
};

export const ColumnConfigurations: FC<ColumnConfigurationsProps> = ({
  table,
  toggleConfiguration,
}: ColumnConfigurationsProps) => {
  // The columns that are hideable in configurations need to be grouped by their parents id in order for display purposes, see enableHiding to toggle viewability of each column
  const groupedHideableColumns = useMemo(() => {
    const allLeafColumns = table
      .getAllLeafColumns()
      .filter(c => c.getCanHide());
    const grouped = groupBy(allLeafColumns, (c: any) => c?.parent?.id);
    return grouped;
  }, [table]);

  return (
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
                          onClick={(e: any) =>
                            toggleConfiguration(!e.target.checked, column.id)
                          }
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
  );
};
