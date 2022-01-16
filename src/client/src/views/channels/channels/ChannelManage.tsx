import * as React from 'react';
import {
  Card,
  Sub4Title,
  Separation,
  SingleLine,
} from '../../../components/generic/Styled';
import { DetailsChange } from '../../../components/details/detailsChange';
import { OpenChannel } from '../../../views/home/quickActions/openChannel';
import { X } from 'react-feather';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';

export const ChannelManage = () => {
  const [openWindow, setOpenWindow] = React.useState<string>('none');

  const renderOpenButton = () => (
    <SingleLine>
      <Sub4Title>Open Channel</Sub4Title>
      <ColorButton
        arrow={openWindow !== 'open'}
        onClick={() =>
          setOpenWindow(prev => (prev === 'none' ? 'open' : 'none'))
        }
      >
        {openWindow === 'open' ? <X size={16} /> : 'Open'}
      </ColorButton>
    </SingleLine>
  );

  const renderDetailsButton = () => (
    <SingleLine>
      <Sub4Title>Change Channel Details</Sub4Title>
      <ColorButton
        withMargin={'8px 0 0'}
        arrow={openWindow !== 'details'}
        onClick={() =>
          setOpenWindow(prev => (prev === 'none' ? 'details' : 'none'))
        }
      >
        {openWindow === 'details' ? <X size={16} /> : 'Change'}
      </ColorButton>
    </SingleLine>
  );

  const renderContent = () => {
    switch (openWindow) {
      case 'open':
        return (
          <>
            {renderOpenButton()}
            <Separation />
            <OpenChannel setOpenCard={() => setOpenWindow('none')} />
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
