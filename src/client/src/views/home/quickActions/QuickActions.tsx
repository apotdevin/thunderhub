import { useState } from 'react';
import { X, Layers, Command, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DecodeCard } from './decode/Decode';
import { SupportCard } from './donate/DonateCard';
import { SupportBar } from './donate/DonateContent';
import { LnUrlCard } from './lnurl';
import { AmbossCard } from './amboss/AmbossCard';
import { LightningAddressCard } from './lightningAddress/LightningAddress';

export const QuickCard = ({
  children,
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded border border-border p-1 text-primary transition-colors hover:border-primary md:h-[100px] md:w-[100px] md:p-2.5 ${className ?? ''}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
);

export const QuickTitle = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`mt-2.5 text-center text-xs text-muted-foreground ${className ?? ''}`}
    {...props}
  >
    {children}
  </div>
);

export const QuickActions = () => {
  const [openCard, setOpenCard] = useState('none');

  const getTitle = () => {
    switch (openCard) {
      case 'decode':
        return 'Decode a Lightning Request';
      case 'ln_url':
        return 'Use lnurl';
      case 'lightning_address':
        return 'Pay to a Lightning Address';
      default:
        return 'Quick Actions';
    }
  };

  const renderContent = () => {
    switch (openCard) {
      case 'support':
        return <SupportBar />;
      case 'decode':
        return <DecodeCard />;
      case 'ln_url':
        return <LnUrlCard />;
      case 'lightning_address':
        return <LightningAddressCard />;
      default:
        return (
          <div className="flex flex-wrap gap-2">
            <SupportCard callback={() => setOpenCard('support')} />
            <AmbossCard />
            <QuickCard onClick={() => setOpenCard('lightning_address')}>
              <Zap size={24} />
              <QuickTitle>Address</QuickTitle>
            </QuickCard>
            <QuickCard onClick={() => setOpenCard('decode')}>
              <Layers size={24} />
              <QuickTitle>Decode</QuickTitle>
            </QuickCard>
            <QuickCard onClick={() => setOpenCard('ln_url')}>
              <Command size={24} />
              <QuickTitle>LNURL</QuickTitle>
            </QuickCard>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{getTitle()}</CardTitle>
          {openCard !== 'none' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenCard('none')}
            >
              <X size={14} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};
