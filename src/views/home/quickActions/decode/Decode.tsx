import React, { useState } from 'react';
import {
  Card,
  Sub4Title,
  ResponsiveLine,
} from '../../../../components/generic/Styled';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { Input } from '../../../../components/input/Input';
import { Decoded } from './Decoded';

export const DecodeCard = ({ color }: { color: string }) => {
  const [request, setRequest] = useState('');
  const [show, setShow] = useState(false);

  return (
    <Card bottom={'20px'}>
      {!show && (
        <ResponsiveLine>
          <Sub4Title>Request:</Sub4Title>
          <Input
            placeholder={'Lightning Invoice'}
            withMargin={'0 0 0 24px'}
            mobileMargin={'0 0 16px'}
            color={color}
            value={request}
            onChange={e => setRequest(e.target.value)}
          />
          <ColorButton
            color={color}
            disabled={request === ''}
            withMargin={'0 0 0 16px'}
            mobileMargin={'0'}
            arrow={true}
            mobileFullWidth={true}
            onClick={() => {
              setShow(true);
            }}
          >
            Decode
          </ColorButton>
        </ResponsiveLine>
      )}
      {show && <Decoded request={request} setShow={setShow} />}
    </Card>
  );
};
