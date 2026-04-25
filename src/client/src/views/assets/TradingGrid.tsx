import { FC } from 'react';
import {
  ResponsiveGridLayout,
  ResponsiveLayouts,
  useContainerWidth,
} from 'react-grid-layout';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { defaultGrid } from '../../utils/gridConstants';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { TradingOffers } from './TradingOffers';
import { TradingOrderForm } from './TradingOrderForm';
import { TradingPeerInfo } from './TradingPeerInfo';
import { TradingHistory } from './TradingHistory';

type TradingWidget = {
  id: string;
  title?: string;
  component: FC;
  default: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    static?: boolean;
  };
};

const widgets: TradingWidget[] = [
  {
    id: 'offers',
    title: 'Offers',
    component: TradingOffers,
    default: { x: 0, y: 0, w: 16, h: 9, minW: 8, minH: 8 },
  },
  {
    id: 'order-form',
    title: 'Order Form',
    component: TradingOrderForm,
    default: { x: 16, y: 0, w: 8, h: 20, minW: 6, maxW: 8, minH: 12 },
  },
  {
    id: 'peer-info',
    title: 'Peer Info',
    component: TradingPeerInfo,
    default: { x: 0, y: 9, w: 5, h: 5, minW: 4, minH: 4 },
  },
  {
    id: 'trade-history',
    title: 'Trade History',
    component: TradingHistory,
    default: { x: 5, y: 9, w: 11, h: 11, minW: 6, minH: 4 },
  },
  {
    id: 'reset',
    component: () => null,
    default: {
      x: 22,
      y: Infinity,
      w: 2,
      h: 1,
      minW: 2,
      maxW: 2,
      minH: 1,
      maxH: 1,
    },
  },
];

export const TradingGrid: FC = () => {
  const { width, containerRef, mounted } = useContainerWidth();

  const [layouts, setLayouts] = useLocalStorage<ResponsiveLayouts>(
    'tradingLayouts',
    {}
  );

  const handleChange = (_: unknown, allLayouts: ResponsiveLayouts) => {
    setLayouts(allLayouts);
  };

  return (
    <div className="w-full" ref={containerRef}>
      {!mounted ? (
        <LoadingCard noCard={true} loadingHeight={'80vh'} />
      ) : (
        <div className="[&_.react-resizable-handle::after]:border-b-2 [&_.react-resizable-handle::after]:border-r-2 [&_.react-resizable-handle::after]:border-foreground">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            rowHeight={28}
            width={width}
            margin={[8, 8]}
            breakpoints={defaultGrid.breakpoints}
            cols={defaultGrid.columns}
            dragConfig={{ bounded: true, handle: '.drag-handle' }}
            onLayoutChange={handleChange}
          >
            {widgets.map(w =>
              w.id === 'reset' ? (
                <div
                  key={w.id}
                  data-grid={w.default}
                  className="flex items-center justify-end"
                >
                  <button
                    onClick={() => setLayouts({})}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                  >
                    <RotateCcw size={10} />
                    Reset layout
                  </button>
                </div>
              ) : (
                <div
                  className={cn(
                    'flex flex-col overflow-hidden rounded-lg bg-background text-card-foreground ring-1 ring-foreground/10'
                  )}
                  key={w.id}
                  data-grid={w.default}
                >
                  <div className="drag-handle px-3 py-1 border-b border-border/60 shrink-0 cursor-grab active:cursor-grabbing select-none">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {w.title}
                    </span>
                  </div>
                  <div className="flex-1 min-h-0 overflow-auto p-3">
                    <w.component />
                  </div>
                </div>
              )
            )}
          </ResponsiveGridLayout>
        </div>
      )}
    </div>
  );
};
