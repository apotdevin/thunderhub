import { Heart } from 'lucide-react';
import { chartColors } from '../../../../styles/Themes';

type SupportCardProps = {
  callback: () => void;
};

export const SupportCard = ({ callback }: SupportCardProps) => {
  return (
    <div
      className="bg-white dark:bg-[#1a1f35] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-[#e1e6ed] dark:border-[#4a5669] h-20 w-20 flex flex-col justify-center items-center p-1 cursor-pointer text-[#69c0ff] md:p-2.5 md:h-[100px] md:w-[100px] group"
      style={{ ['--hover-bg' as string]: chartColors.green }}
      onClick={callback}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          chartColors.green;
        (e.currentTarget as HTMLElement).style.color = 'white';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '';
        (e.currentTarget as HTMLElement).style.color = '#69c0ff';
      }}
    >
      <Heart size={24} />
      <div className="text-xs text-muted-foreground mt-2.5 group-hover:text-white">
        Donate
      </div>
    </div>
  );
};
