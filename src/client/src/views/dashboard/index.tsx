import {
  ResponsiveGridLayout,
  ResponsiveLayouts,
  useContainerWidth,
} from 'react-grid-layout';
import { defaultGrid } from '../../utils/gridConstants';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import { LoadingCard } from '../../components/loading/LoadingCard';

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
  const { width, containerRef, mounted } = useContainerWidth();

  const { modalType } = useDashState();
  const dispatch = useDashDispatch();

  const [layouts, setLayouts] = useLocalStorage<ResponsiveLayouts>(
    'layouts',
    {}
  );
  const [availableWidgets] = useLocalStorage<StoredWidget[]>(
    'dashboardWidgets',
    []
  );

  const handleChange = (_: any, layouts: any) => {
    setLayouts(layouts);
  };

  const widgets = getWidgets(availableWidgets, width, [{ id: 28 }]);

  if (!widgets.length) {
    return (
      <div className="h-[80vh] w-full flex flex-col justify-center items-center">
        <h4 className="text-lg font-medium">No Widgets Enabled!</h4>
        <Link href={'settings/dashboard'}>
          <Button variant="outline">
            Settings <ChevronRight size={18} />
          </Button>
        </Link>
      </div>
    );
  }

  const renderContent = () => {
    if (!mounted) {
      return <LoadingCard noCard={true} loadingHeight={'90vh'} />;
    }
    return (
      <>
        <div className="[&_.react-resizable-handle::after]:border-b-2 [&_.react-resizable-handle::after]:border-r-2 [&_.react-resizable-handle::after]:border-foreground">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            rowHeight={28}
            width={width}
            margin={[8, 8]}
            breakpoints={defaultGrid.breakpoints}
            cols={defaultGrid.columns}
            dragConfig={{ bounded: true }}
            onLayoutChange={handleChange}
          >
            {widgets.map(w => (
              <div
                className="flex justify-center items-center overflow-hidden rounded-lg bg-background text-card-foreground ring-1 ring-foreground/10 p-2"
                key={w.id}
                data-grid={w.default}
              >
                <w.component />
              </div>
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
    <div className="w-full" ref={containerRef}>
      {renderContent()}
    </div>
  );
};

export default Dashboard;
