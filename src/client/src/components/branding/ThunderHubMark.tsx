import { Zap } from 'lucide-react';

import { cn } from '@/lib/utils';

type ThunderHubMarkProps = {
  className?: string;
  iconClassName?: string;
};

export const ThunderHubMark = ({
  className,
  iconClassName,
}: ThunderHubMarkProps) => (
  <div className={cn('relative h-11 w-11 shrink-0', className)}>
    <div className="absolute inset-0 rounded-[0.95rem] bg-[radial-gradient(circle_at_30%_25%,rgba(255,234,179,0.95),rgba(255,184,77,0.92)_34%,rgba(255,132,0,0.88)_62%,rgba(140,62,0,0.95)_100%)] shadow-[0_10px_20px_-16px_rgba(255,145,0,0.85)]" />
    <div className="absolute inset-[2px] rounded-[0.8rem] border border-white/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.26),rgba(255,255,255,0.04))]" />
    <div className="absolute inset-x-2 top-1.5 h-3 rounded-full bg-white/20 blur-md" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="rounded-[0.7rem] border border-black/10 bg-black/10 p-1.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-sm">
        <Zap size={15} className={cn('fill-current', iconClassName)} />
      </div>
    </div>
  </div>
);
