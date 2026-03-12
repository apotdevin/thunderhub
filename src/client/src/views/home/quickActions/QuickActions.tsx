import { useState } from 'react';
import { X, Layers, Command, Zap } from 'lucide-react';
import {
  CardWithTitle,
  SubTitle,
  CardTitle,
  SmallButton,
  Card,
} from '../../../components/generic/Styled';
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
    className={`bg-card shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-border h-20 w-20 flex flex-col justify-center items-center p-1 cursor-pointer text-primary md:p-2.5 md:h-[100px] md:w-[100px] hover:border-primary ${className ?? ''}`}
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
    className={`text-xs text-muted-foreground mt-2.5 text-center ${className ?? ''}`}
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
        return (
          <Card>
            <SupportBar />
          </Card>
        );
      case 'decode':
        return <DecodeCard />;
      case 'ln_url':
        return <LnUrlCard />;
      case 'lightning_address':
        return <LightningAddressCard />;
      default:
        return (
          <div className="flex flex-wrap gap-2 my-4 mb-8">
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
    <CardWithTitle>
      <CardTitle>
        <SubTitle>{getTitle()}</SubTitle>
        {openCard !== 'none' && (
          <SmallButton onClick={() => setOpenCard('none')}>
            <X size={18} />
          </SmallButton>
        )}
      </CardTitle>
      {renderContent()}
    </CardWithTitle>
  );
};
