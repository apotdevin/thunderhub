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
        <span className="inline-flex shrink-0 cursor-help text-muted-foreground/50">
          <Calculator size={10} />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">
        Parsed by ThunderHub from the raw description.
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
