import { useState } from 'react';
import {
  Card,
  Sub4Title,
  Separation,
  SingleLine,
} from '../../../components/generic/Styled';
import { DetailsChange } from '../../../components/details/detailsChange';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OpenChannel } from '../../home/liquidity/OpenChannel';

export const ChannelManage = () => {
  const [openWindow, setOpenWindow] = useState<string>('none');

  const renderOpenButton = () => (
    <SingleLine>
      <Sub4Title>Open Channel</Sub4Title>
      <Button
        variant="outline"
        onClick={() =>
          setOpenWindow(prev => (prev === 'none' ? 'open' : 'none'))
        }
      >
        {openWindow === 'open' ? (
          <X size={16} />
        ) : (
          <>Open {openWindow !== 'open' && <ChevronRight size={18} />}</>
        )}
      </Button>
    </SingleLine>
  );

  const renderDetailsButton = () => (
    <SingleLine>
      <Sub4Title>Change Channel Details</Sub4Title>
      <Button
        variant="outline"
        style={{ margin: '8px 0 0' }}
        onClick={() =>
          setOpenWindow(prev => (prev === 'none' ? 'details' : 'none'))
        }
      >
        {openWindow === 'details' ? (
          <X size={16} />
        ) : (
          <>Change {openWindow !== 'details' && <ChevronRight size={18} />}</>
        )}
      </Button>
    </SingleLine>
  );

  const renderContent = () => {
    switch (openWindow) {
      case 'open':
        return (
          <>
            {renderOpenButton()}
            <Separation />
            <OpenChannel closeCbk={() => setOpenWindow('none')} />
          </>
        );
      case 'details':
        return (
          <>
            {renderDetailsButton()}
            <Separation />
            <DetailsChange />
          </>
        );
      default:
        return (
          <>
            {renderOpenButton()}
            {renderDetailsButton()}
          </>
        );
    }
  };

  return <Card>{renderContent()}</Card>;
};
