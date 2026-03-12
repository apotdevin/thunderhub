import {
  CardTitle,
  CardWithTitle,
  SmallButton,
  SubTitle,
} from '../../../components/generic/Styled';
import { ArrowDownRight, ArrowUpRight, X } from 'lucide-react';
import { useState } from 'react';
import { OpenChannel } from './OpenChannel';
import { BuyChannel, GoToMagma } from './BuyChannel';

export const Liquidity = () => {
  const [openCard, setOpenCard] = useState('none');

  const getContent = () => {
    switch (openCard) {
      case 'open':
        return <OpenChannel closeCbk={() => setOpenCard('none')} />;
      case 'buy':
        return <BuyChannel />;
      default:
        return (
          <div className="grid md:grid-cols-2 gap-4 my-4">
            <div
              className="bg-card shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-border flex justify-center items-center p-2.5 cursor-pointer text-primary gap-2 hover:border-primary"
              onClick={() => setOpenCard('open')}
            >
              <ArrowUpRight size={24} />
              <div className="text-sm text-muted-foreground text-center">
                Open a Channel
              </div>
            </div>
            <div
              className="bg-card shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-border flex justify-center items-center p-2.5 cursor-pointer text-primary gap-2 hover:border-primary"
              onClick={() => setOpenCard('buy')}
            >
              <ArrowDownRight size={24} />
              <div className="text-sm text-muted-foreground text-center">
                Buy Inbound Liquidity
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Liquidity</SubTitle>

        <div style={{ display: 'flex' }}>
          {openCard === 'buy' ? <GoToMagma /> : null}

          {openCard !== 'none' && (
            <SmallButton onClick={() => setOpenCard('none')}>
              <X size={18} />
            </SmallButton>
          )}
        </div>
      </CardTitle>
      {getContent()}
    </CardWithTitle>
  );
};
