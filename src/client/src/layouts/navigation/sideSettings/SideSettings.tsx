import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import {
  useConfigState,
  useConfigDispatch,
} from '../../../context/ConfigContext';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

export const SideSettings = () => {
  const { sidebar } = useConfigState();
  const dispatch = useConfigDispatch();

  const toggle = () => {
    localStorage.setItem('sidebar', (!sidebar).toString());
    dispatch({ type: 'change', sidebar: !sidebar });
  };

  const button = (
    <button
      className={cn(
        'flex items-center gap-2 rounded-md text-xs font-medium transition-colors cursor-pointer',
        'text-muted-foreground hover:text-foreground hover:bg-accent/50',
        sidebar ? 'px-2.5 py-1.5 w-full' : 'justify-center p-2'
      )}
      onClick={toggle}
    >
      {sidebar ? (
        <>
          <ChevronLeft size={15} className="shrink-0" />
          <span>Collapse</span>
        </>
      ) : (
        <ChevronRight size={15} className="shrink-0" />
      )}
    </button>
  );

  if (!sidebar) {
    return (
      <div className="flex justify-center w-full">
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Expand
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return button;
};
