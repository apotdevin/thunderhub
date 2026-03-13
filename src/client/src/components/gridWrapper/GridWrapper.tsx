import { FC, ReactNode } from 'react';
import { BitcoinFees } from '@/components/bitcoinInfo/BitcoinFees';
import { BitcoinPrice } from '@/components/bitcoinInfo/BitcoinPrice';
import { Navigation } from '../../layouts/navigation/Navigation';
import { cn } from '@/lib/utils';

type GridProps = {
  children?: ReactNode;
};

export const GridWrapper: FC<GridProps & { centerContent?: boolean }> = ({
  children,
  centerContent = true,
}) => (
  <div className="w-full md:p-[16px_16px_32px]">
    <div
      className={cn(
        'grid grid-cols-[auto_1fr_200px] [grid-template-areas:"nav_content_content"] md:grid',
        'flex flex-col md:grid md:grid-cols-[auto_1fr_200px]',
        'gap-4'
      )}
    >
      <BitcoinPrice />
      <BitcoinFees />
      <Navigation />
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
  <div className="w-full bg-muted md:p-4">
    <BitcoinPrice />
    <BitcoinFees />
    {children}
  </div>
);
