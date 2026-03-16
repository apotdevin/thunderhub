import { useConfigState } from '../../context/ConfigContext';
import { BalancesContent } from './BalancesContent';
import { SidebarSwap } from './SidebarSwap';
import { EventLog } from './EventLog';

export const RightSidebar = () => {
  const { rightSidebar } = useConfigState();

  if (!rightSidebar) return null;

  return (
    <div className="hidden lg:flex flex-col shrink-0 w-[320px] border-l border-border/60">
      <div className="sticky top-[77px] flex flex-col max-h-[calc(100vh-77px)]">
        <div className="w-[320px] shrink-0">
          <BalancesContent />
          <SidebarSwap />
        </div>
        <div className="flex-1 min-h-0 w-[320px] flex flex-col">
          <EventLog />
        </div>
      </div>
    </div>
  );
};
