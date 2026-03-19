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
    className={`flex cursor-pointer items-center gap-2 rounded border border-border px-3 py-2 text-primary transition-colors ${className ?? ''}`}
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
    className={`text-xs text-muted-foreground ${className ?? ''}`}
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
            <QuickCard
              className="hover:border-yellow-500/30 hover:bg-yellow-500/5"
              onClick={() => setOpenCard('lightning_address')}
            >
              <Zap size={16} className="text-yellow-500" />
              <QuickTitle>Address</QuickTitle>
            </QuickCard>
            <QuickCard
              className="hover:border-blue-500/30 hover:bg-blue-500/5"
              onClick={() => setOpenCard('decode')}
            >
              <Layers size={16} className="text-blue-500" />
              <QuickTitle>Decode</QuickTitle>
            </QuickCard>
            <QuickCard
              className="hover:border-emerald-500/30 hover:bg-emerald-500/5"
              onClick={() => setOpenCard('ln_url')}
            >
              <Command size={16} className="text-emerald-500" />
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
