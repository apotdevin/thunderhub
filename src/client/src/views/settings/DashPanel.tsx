import { groupBy } from 'lodash';
import { Fragment } from 'react';
import { Layouts } from 'react-grid-layout';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { Card, SubTitle } from '../../components/generic/Styled';
import { Link } from '../../components/link/Link';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import styled from 'styled-components';
import { StoredWidget } from '../dashboard';
import { widgetList } from '../dashboard/widgets/widgetList';
import { WidgetRow } from './WidgetRow';

const S = {
  subTitle: styled(SubTitle)`
    margin: 32px 0 8px;
  `,
};

export type NormalizedWidgets = {
  id: number;
  name: string;
  group: string;
  active: boolean;
};

const DashPanel = () => {
  const [, setLayouts] = useLocalStorage<Layouts>('layouts', {});
  const [availableWidgets, setAvailableWidgets] = useLocalStorage<
    StoredWidget[]
  >('dashboardWidgets', []);

  const normalizedList: NormalizedWidgets[] = widgetList.reduce((p, w) => {
    if (w.hidden) return p;

    const active =
      availableWidgets.findIndex((a: StoredWidget) => {
        return a.id === w.id;
      }) >= 0;

    return [...p, { ...w, active }];
  }, [] as NormalizedWidgets[]);

  const handleAdd = (id: number) => {
    const filtered = availableWidgets.filter(a => a.id !== id);
    setAvailableWidgets([...filtered, { id }]);
  };

  const handleDelete = (id: number) => {
    const filtered = availableWidgets.filter(a => a.id !== id);
    setAvailableWidgets(filtered);
  };

  const grouped = groupBy(normalizedList, 'group');
  const keys = Object.keys(grouped);

  return (
    <Card>
      {keys.map((key, index) => {
        const widgets = grouped[key];
        const subGrouped = groupBy(widgets, 'subgroup');
        const subKeys = Object.keys(subGrouped);

        return subKeys.map((subKey, subIndex) => {
          const subWidgets = subGrouped[subKey];

          return (
            <Fragment key={key + index + subIndex}>
              <S.subTitle>{subKey ? `${key} - ${subKey}` : key}</S.subTitle>
              {subWidgets.map(w => (
                <Fragment key={w.id}>
                  <WidgetRow
                    widget={w}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                  />
                </Fragment>
              ))}
            </Fragment>
          );
        });
      })}
      <Link href={'/dashboard'}>
        <ColorButton withMargin={'16px 0 0'} width={'100%'} arrow={true}>
          To Dashboard
        </ColorButton>
      </Link>
      <ColorButton
        withMargin={'8px 0 0'}
        width={'100%'}
        onClick={() => {
          setLayouts({});
          setAvailableWidgets([]);
        }}
      >
        Reset Widgets
      </ColorButton>
    </Card>
  );
};

export default DashPanel;
