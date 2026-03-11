import { FC, ReactNode } from 'react';
import { BitcoinFees } from '@/components/bitcoinInfo/BitcoinFees';
import { BitcoinPrice } from '@/components/bitcoinInfo/BitcoinPrice';
import { Navigation } from '../../layouts/navigation/Navigation';
import { cn } from '@/lib/utils';

type GridProps = {
  noNavigation?: boolean;
  children?: ReactNode;
};

export const GridWrapper: FC<
  GridProps & { centerContent?: boolean; children?: ReactNode }
> = ({ children, centerContent = true, noNavigation }) => (
  <div className="w-full bg-[#f5f6f9] dark:bg-[#181c30] md:p-[16px_16px_32px]">
    <div
      className={cn(
        'grid grid-cols-[auto_1fr_200px] [grid-template-areas:"nav_content_content"] md:grid',
        'flex flex-col md:grid md:grid-cols-[auto_1fr_200px]',
        !noNavigation && 'gap-4'
      )}
    >
      <BitcoinPrice />
      <BitcoinFees />
      {!noNavigation && <Navigation />}
      <div className="[grid-area:content]">
        {centerContent ? (
          <div className="max-w-[1000px] mx-auto px-4 lg:px-0">{children}</div>
        ) : (
          children
        )}
      </div>
    </div>
  </div>
);

export const SimpleWrapper: FC<GridProps> = ({ children }) => (
  <div className="w-full bg-[#f5f6f9] dark:bg-[#181c30] md:p-4">
    <BitcoinPrice />
    <BitcoinFees />
    {children}
  </div>
);
