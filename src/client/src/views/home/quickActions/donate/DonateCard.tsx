import { Heart } from 'lucide-react';
import { useChartColors } from '../../../../lib/chart-colors';

type SupportCardProps = {
  callback: () => void;
};

export const SupportCard = ({ callback }: SupportCardProps) => {
  const chartColors = useChartColors();

  return (
    <div
      className="bg-card shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-border h-20 w-20 flex flex-col justify-center items-center p-1 cursor-pointer text-primary md:p-2.5 md:h-[100px] md:w-[100px] group"
      style={{ ['--hover-bg' as string]: chartColors.green }}
      onClick={callback}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          chartColors.green;
        (e.currentTarget as HTMLElement).style.color = 'white';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '';
        (e.currentTarget as HTMLElement).style.color = '';
      }}
    >
      <Heart size={24} />
      <div className="text-xs text-muted-foreground mt-2.5 group-hover:text-white">
        Donate
      </div>
    </div>
  );
};
