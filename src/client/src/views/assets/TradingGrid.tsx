import { FC, ReactNode } from 'react';
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
import { TradingPartners } from './TradingPartners';
import { TradingOrderForm } from './TradingOrderForm';
import { TradingPeerInfo } from './TradingPeerInfo';
import { TradingHistory } from './TradingHistory';
import { TradingPortfolio } from './TradingPortfolio';
import { TradingDistribution } from './TradingDistribution';
import { TradingAssetSelector } from './TradingAssetSelector';

// Below this container width, drop the configurable grid in favor of a static
// vertical stack so phone users (and demos) can't accidentally drag or resize
// widgets.
const MOBILE_BREAKPOINT = 768;

type TradingWidget = {
  id: string;
  title: string;
  headerRight?: ReactNode;
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
    id: 'partners',
    title: 'Trading Partners',
    component: TradingPartners,
    default: { x: 0, y: 0, w: 5, h: 9, minW: 4, minH: 4 },
  },
  {
    id: 'offers',
    title: 'Offers',
    headerRight: <TradingAssetSelector />,
    component: TradingOffers,
    default: { x: 5, y: 0, w: 11, h: 9, minW: 6, minH: 6 },
  },
  {
    id: 'order-form',
    title: 'Order Form',
    component: TradingOrderForm,
    default: { x: 16, y: 0, w: 8, h: 20, minW: 6, maxW: 8, minH: 12 },
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    component: TradingPortfolio,
    default: { x: 0, y: 13, w: 5, h: 7, minW: 4, minH: 4 },
  },
  {
    id: 'distribution',
    title: 'Distribution',
    component: TradingDistribution,
    default: { x: 0, y: 9, w: 16, h: 3, minW: 8, minH: 3 },
  },
  {
    id: 'peer-info',
    title: 'Peer Info',
    component: TradingPeerInfo,
    default: { x: 0, y: 21, w: 5, h: 4, minW: 4, minH: 4 },
  },
  {
    id: 'trade-history',
    title: 'Trade History',
    component: TradingHistory,
    default: { x: 5, y: 13, w: 11, h: 11, minW: 6, minH: 4 },
  },
];

// Use the desktop reading order (top-to-bottom, then left-to-right) for the
// mobile stack so it stays in sync if widgets are added or repositioned.
const mobileWidgets = [...widgets].sort(
  (a, b) => a.default.y - b.default.y || a.default.x - b.default.x
);

const resetWidgetGrid = {
  x: 22,
  y: Infinity,
  w: 2,
  h: 1,
  minW: 2,
  maxW: 2,
  minH: 1,
  maxH: 1,
};

const cardClass =
  'flex flex-col overflow-hidden rounded-lg bg-background text-card-foreground ring-1 ring-foreground/10';

const cardHeaderClass =
  'flex items-center justify-between px-3 py-1 border-b border-border/60 shrink-0';

const cardTitleClass =
  'text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60';

const TradingMobileStack: FC = () => (
  <div className="flex flex-col gap-2 p-2">
    {mobileWidgets.map(w => (
      <div key={w.id} className={cardClass}>
        <div className={cardHeaderClass}>
          <span className={cardTitleClass}>{w.title}</span>
          {w.headerRight}
        </div>
        <div className="p-3 overflow-x-auto">
          <w.component />
        </div>
      </div>
    ))}
  </div>
);

type TradingResponsiveGridProps = {
  width: number;
  layouts: ResponsiveLayouts;
  onLayoutChange: (_: unknown, allLayouts: ResponsiveLayouts) => void;
  onReset: () => void;
};

const TradingResponsiveGrid: FC<TradingResponsiveGridProps> = ({
  width,
  layouts,
  onLayoutChange,
  onReset,
}) => (
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
      onLayoutChange={onLayoutChange}
    >
      {widgets.map(w => (
        <div className={cardClass} key={w.id} data-grid={w.default}>
          <div
            className={cn(
              cardHeaderClass,
              'drag-handle cursor-grab active:cursor-grabbing select-none'
            )}
          >
            <span className={cardTitleClass}>{w.title}</span>
            {w.headerRight && (
              <div
                className="cursor-default"
                onMouseDown={e => e.stopPropagation()}
              >
                {w.headerRight}
              </div>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-auto p-3">
            <w.component />
          </div>
        </div>
      ))}
      <div
        key="reset"
        data-grid={resetWidgetGrid}
        className="flex items-center justify-end"
      >
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <RotateCcw size={10} />
          Reset layout
        </button>
      </div>
    </ResponsiveGridLayout>
  </div>
);

export const TradingGrid: FC = () => {
  const { width, containerRef, mounted } = useContainerWidth();

  const [layouts, setLayouts] = useLocalStorage<ResponsiveLayouts>(
    'tradingLayouts',
    {}
  );

  const handleLayoutChange = (_: unknown, allLayouts: ResponsiveLayouts) => {
    setLayouts(allLayouts);
  };

  const isMobile = mounted && width > 0 && width < MOBILE_BREAKPOINT;

  return (
    <div className="w-full" ref={containerRef}>
      {!mounted ? (
        <LoadingCard noCard={true} loadingHeight={'80vh'} />
      ) : isMobile ? (
        <TradingMobileStack />
      ) : (
        <TradingResponsiveGrid
          width={width}
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          onReset={() => setLayouts({})}
        />
      )}
    </div>
  );
};
