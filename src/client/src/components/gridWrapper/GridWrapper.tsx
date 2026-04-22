import { FC, ReactNode } from 'react';
import { BitcoinFees } from '@/components/bitcoinInfo/BitcoinFees';
import { BitcoinPrice } from '@/components/bitcoinInfo/BitcoinPrice';

type GridProps = {
  children?: ReactNode;
};

export const GridWrapper: FC<GridProps & { centerContent?: boolean }> = ({
  children,
  centerContent = true,
}) => (
  <div className="w-full px-4 py-4 md:pl-4 md:pr-4">
    <BitcoinPrice />
    <BitcoinFees />
    {centerContent ? (
      <div className="max-w-250 mx-auto">{children}</div>
    ) : (
      children
    )}
  </div>
);

export const SimpleWrapper: FC<GridProps> = ({ children }) => (
  <div className="w-full bg-muted md:p-4">
    <BitcoinPrice />
    <BitcoinFees />
    {children}
  </div>
);
