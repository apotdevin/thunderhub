import { useState } from 'react';
import { Anchor, X, Zap } from 'react-feather';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { Card } from 'src/components/generic/Styled';
import { mediaWidths } from 'src/styles/Themes';
import styled from 'styled-components';
import { CreateInvoiceCard } from './createInvoice/CreateInvoice';
import { PayCard } from './pay/Payment';
import { ReceiveOnChainCard } from './receiveOnChain/ReceiveOnChain';
import { SendOnChainCard } from './sendOnChain/SendOnChain';

const SECTION_COLOR = '#FFD300';

const S = {
  grid: styled.div`
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-bottom: 32px;

    @media (${mediaWidths.mobile}) {
      grid-template-columns: 1fr 1fr;
    }
  `,
};

export const AccountButtons = () => {
  const [state, setState] = useState<string>('none');

  const renderContent = () => {
    switch (state) {
      case 'send_ln':
        return <PayCard setOpen={() => setState('none')} />;
      case 'receive_ln':
        return <CreateInvoiceCard color={SECTION_COLOR} />;
      case 'send_chain':
        return <SendOnChainCard setOpen={() => setState('none')} />;
      case 'receive_chain':
        return <ReceiveOnChainCard />;
      default:
        return null;
    }
  };

  return (
    <>
      <S.grid>
        <ColorButton
          withBorder={state === 'send_ln'}
          onClick={() => setState(state === 'send_ln' ? 'none' : 'send_ln')}
        >
          {state === 'send_ln' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Zap size={18} color={SECTION_COLOR} />
          )}
          Send
        </ColorButton>
        <ColorButton
          withBorder={state === 'receive_ln'}
          onClick={() =>
            setState(state === 'receive_ln' ? 'none' : 'receive_ln')
          }
        >
          {state === 'receive_ln' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Zap size={18} color={SECTION_COLOR} />
          )}
          Receive
        </ColorButton>
        <ColorButton
          withBorder={state === 'send_chain'}
          onClick={() =>
            setState(state === 'send_chain' ? 'none' : 'send_chain')
          }
        >
          {state === 'send_chain' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Anchor size={18} color={SECTION_COLOR} />
          )}
          Send
        </ColorButton>
        <ColorButton
          withBorder={state === 'receive_chain'}
          onClick={() =>
            setState(state === 'receive_chain' ? 'none' : 'receive_chain')
          }
        >
          {state === 'receive_chain' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Anchor size={18} color={SECTION_COLOR} />
          )}
          Receive
        </ColorButton>
      </S.grid>
      {state !== 'none' && <Card>{renderContent()}</Card>}
    </>
  );
};
