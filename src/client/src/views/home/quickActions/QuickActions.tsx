import { useState, type FC } from 'react';
import { X, Layers, Command, Zap, Heart, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DecodeCard } from './decode/Decode';
import { SupportBar } from './donate/DonateContent';
import { LnUrlCard } from './lnurl';
import { AmbossGridItem } from './amboss/AmbossCard';
import { LightningAddressCard } from './lightningAddress/LightningAddress';

export const QuickCard = ({
  children,
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-primary transition-all duration-150',
      className
    )}
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
  <div className={cn('text-xs text-muted-foreground', className)} {...props}>
    {children}
  </div>
);

const QuickGridItem = ({
  icon: Icon,
  imgSrc,
  label,
  iconClassName,
  glowClassName,
  onClick,
}: {
  icon?: FC<LucideProps>;
  imgSrc?: string;
  label: string;
  iconClassName?: string;
  glowClassName?: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'group/quick flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1.5 transition-all duration-200 cursor-pointer',
      'hover:border-border hover:bg-muted/50',
      glowClassName
    )}
  >
    <div
      className={cn(
        'flex items-center justify-center size-6 rounded-md bg-muted/60 transition-colors duration-200 group-hover/quick:bg-muted',
        iconClassName?.includes('pink') && 'group-hover/quick:bg-pink-500/10',
        iconClassName?.includes('purple') &&
          'group-hover/quick:bg-purple-500/10',
        iconClassName?.includes('yellow') &&
          'group-hover/quick:bg-yellow-500/10',
        iconClassName?.includes('blue') && 'group-hover/quick:bg-blue-500/10',
        iconClassName?.includes('emerald') &&
          'group-hover/quick:bg-emerald-500/10'
      )}
    >
      {Icon && <Icon size={12} className={iconClassName} />}
      {imgSrc && <img src={imgSrc} width={12} height={12} alt={label} />}
    </div>
    <span className="text-[11px] font-medium text-muted-foreground group-hover/quick:text-foreground transition-colors">
      {label}
    </span>
  </button>
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
          <div className="flex flex-wrap gap-1">
            <QuickGridItem
              icon={Heart}
              label="Donate"
              iconClassName="text-pink-500"
              glowClassName="hover:shadow-[0_0_12px_-3px] hover:shadow-pink-500/20"
              onClick={() => setOpenCard('support')}
            />
            <AmbossGridItem />
            <QuickGridItem
              icon={Zap}
              label="Address"
              iconClassName="text-yellow-500"
              glowClassName="hover:shadow-[0_0_12px_-3px] hover:shadow-yellow-500/20"
              onClick={() => setOpenCard('lightning_address')}
            />
            <QuickGridItem
              icon={Layers}
              label="Decode"
              iconClassName="text-blue-500"
              glowClassName="hover:shadow-[0_0_12px_-3px] hover:shadow-blue-500/20"
              onClick={() => setOpenCard('decode')}
            />
            <QuickGridItem
              icon={Command}
              label="LNURL"
              iconClassName="text-emerald-500"
              glowClassName="hover:shadow-[0_0_12px_-3px] hover:shadow-emerald-500/20"
              onClick={() => setOpenCard('ln_url')}
            />
          </div>
        );
    }
  };

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{getTitle()}</CardTitle>
          {openCard !== 'none' && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => setOpenCard('none')}
            >
              <X size={12} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};
