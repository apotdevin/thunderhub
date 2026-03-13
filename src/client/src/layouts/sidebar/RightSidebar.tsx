import { useConfigState } from '../../context/ConfigContext';
import { BalancesContent } from './BalancesContent';

export const RightSidebar = () => {
  const { rightSidebar } = useConfigState();

  if (!rightSidebar) return null;

  return (
    <div className="hidden lg:flex flex-col shrink-0 w-[320px] border-l border-border/60">
      <div className="sticky top-[77px]">
        <div className="w-[320px]">
          <BalancesContent />
        </div>
      </div>
    </div>
  );
};
