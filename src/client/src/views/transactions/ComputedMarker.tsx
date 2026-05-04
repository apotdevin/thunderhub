import { Calculator } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const ComputedMarker = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex shrink-0 cursor-help text-amber-600 dark:text-amber-400">
          <Calculator size={12} />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">
        Computed by ThunderHub from the raw trade memo.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
