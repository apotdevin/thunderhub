import { Layouts, Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import styled, { css } from 'styled-components';
import { defaultGrid } from '../../utils/gridConstants';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { useRef } from 'react';
import useElementSize from '../../hooks/UseElementSize';
import { Card, SubTitle } from '../../components/generic/Styled';
import { textColor } from '../../styles/Themes';
import { Link } from '../../components/link/Link';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { useDashDispatch, useDashState } from '../../context/DashContext';
import Modal from '../../components/modal/ReactModal';
import { getWidgets } from './widgets/helpers';
import { DashboardModal } from './modal';

const S = {
  styles: styled.div`
    .react-resizable-handle::after {
      border-bottom: 2px solid ${textColor};
      border-right: 2px solid ${textColor};
    }
  `,
  card: styled(Card)<{ widgetColor?: string }>`
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 4px;
    padding: 8px;
    ${({ widgetColor }) => css`
      border-top: 2px solid #${widgetColor};
    `}
  `,
  gridWrapper: styled.div`
    width: 100%;
  `,
  fill: styled.div`
    height: 80vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
};

export type StoredWidget = {
  id: number;
};

const Dashboard = () => {
  const wrapperRef = useRef(null);

  const { width } = useElementSize(wrapperRef);

  const { modalType } = useDashState();
  const dispatch = useDashDispatch();

  const [layouts, setLayouts] = useLocalStorage<Layouts>('layouts', {});
  const [availableWidgets] = useLocalStorage<StoredWidget[]>(
    'dashboardWidgets',
    []
  );

  const props = {
    isBounded: true,
  };

  const handleChange = (_: any, layouts: any) => {
    setLayouts(layouts);
  };

  const widgets = getWidgets(availableWidgets, width, [{ id: 28 }]);

  if (!widgets.length) {
    return (
      <S.fill>
        <SubTitle>No Widgets Enabled!</SubTitle>
        <Link href={'settings/dashboard'}>
          <ColorButton arrow={true}>Settings</ColorButton>
        </Link>
      </S.fill>
    );
  }

  const renderContent = () => {
    if (width === 0) {
      return <LoadingCard noCard={true} loadingHeight={'90vh'} />;
    }
    return (
      <>
        <S.styles>
          <ResponsiveGridLayout
            {...props}
            className="layout"
            layouts={layouts}
            rowHeight={28}
            width={width}
            margin={defaultGrid.margin}
            breakpoints={defaultGrid.breakpoints}
            cols={defaultGrid.columns}
            onLayoutChange={handleChange}
          >
            {widgets.map(w => (
              <S.card widgetColor={w.color} key={w.id} data-grid={w.default}>
                <w.component />
              </S.card>
            ))}
          </ResponsiveGridLayout>
        </S.styles>
        <Modal
          isOpen={!!modalType}
          closeCallback={() => dispatch({ type: 'openModal', modalType: '' })}
        >
          <DashboardModal />
        </Modal>
      </>
    );
  };

  return <S.gridWrapper ref={wrapperRef}>{renderContent()}</S.gridWrapper>;
};

export default Dashboard;
