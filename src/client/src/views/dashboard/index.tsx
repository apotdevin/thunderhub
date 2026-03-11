import { Layouts, Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { defaultGrid } from '../../utils/gridConstants';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { useRef } from 'react';
import useElementSize from '../../hooks/UseElementSize';
import { Card, SubTitle } from '../../components/generic/Styled';
import { Link } from '../../components/link/Link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useDashDispatch, useDashState } from '../../context/DashContext';
import Modal from '../../components/modal/ReactModal';
import { getWidgets } from './widgets/helpers';
import { DashboardModal } from './modal';

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
      <div className="h-[80vh] w-full flex flex-col justify-center items-center">
        <SubTitle>No Widgets Enabled!</SubTitle>
        <Link href={'settings/dashboard'}>
          <Button variant="outline">
            Settings <ChevronRight size={18} />
          </Button>
        </Link>
      </div>
    );
  }

  const renderContent = () => {
    if (width === 0) {
      return <LoadingCard noCard={true} loadingHeight={'90vh'} />;
    }
    return (
      <>
        <div className="[&_.react-resizable-handle::after]:border-b-2 [&_.react-resizable-handle::after]:border-r-2 [&_.react-resizable-handle::after]:border-[#212735] [&_.react-resizable-handle::after]:dark:border-white">
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
              <Card
                className="flex justify-center items-center rounded p-2"
                style={{ borderTop: `2px solid #${w.color}` }}
                key={w.id}
                data-grid={w.default}
              >
                <w.component />
              </Card>
            ))}
          </ResponsiveGridLayout>
        </div>
        <Modal
          isOpen={!!modalType}
          closeCallback={() => dispatch({ type: 'openModal', modalType: '' })}
        >
          <DashboardModal />
        </Modal>
      </>
    );
  };

  return (
    <div className="w-full" ref={wrapperRef}>
      {renderContent()}
    </div>
  );
};

export default Dashboard;
