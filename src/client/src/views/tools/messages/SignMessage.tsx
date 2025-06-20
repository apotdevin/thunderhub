import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Copy, Check } from 'react-feather';
import { useSignMessageLazyQuery } from '../../../graphql/queries/__generated__/signMessage.generated';
import { Input } from '../../../components/input';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import {
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { Column, WrapRequest } from '../Tools.styled';
import { NoWrap } from './Messages';
import useCopyClipboard from '../../../hooks/UseCopyToClipboard';

export const SignMessage = () => {
  const [message, setMessage] = useState<string>('');
  const [signed, setSigned] = useState<string>('');

  const [isCopied, copy] = useCopyClipboard({ successDuration: 1000 });

  const [signMessage, { data, loading }] = useSignMessageLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.signMessage) {
      setSigned(data.signMessage);
    }
  }, [loading, data]);

  const renderInput = () => (
    <>
      <SingleLine>
        <NoWrap>
          <DarkSubTitle>Message: </DarkSubTitle>
        </NoWrap>
        <Input
          withMargin={'8px 0 0'}
          onChange={e => setMessage(e.target.value)}
        />
      </SingleLine>
      <ColorButton
        onClick={() => signMessage({ variables: { message } })}
        fullWidth={true}
        withMargin={'8px 0 4px'}
        disabled={message === ''}
        loading={loading}
      >
        Sign
      </ColorButton>
    </>
  );

  const renderMessage = () => (
    <>
      <Separation />
      <Column>
        <WrapRequest>{signed}</WrapRequest>

        <ColorButton onClick={() => copy(signed)}>
          {isCopied ? <Check size={18} /> : <Copy size={18} />}
          Copy
        </ColorButton>
      </Column>
    </>
  );

  return (
    <>
      {renderInput()}
      {signed !== '' && renderMessage()}
    </>
  );
};

export const SignMessageCard = () => {
  const [isPasting, setIsPasting] = useState<boolean>(false);

  return (
    <>
      <SingleLine>
        <DarkSubTitle>Sign Message</DarkSubTitle>
        <ColorButton
          withMargin={'4px 0'}
          arrow={!isPasting}
          onClick={() => setIsPasting(prev => !prev)}
        >
          {isPasting ? <X size={18} /> : 'Sign'}
        </ColorButton>
      </SingleLine>
      {isPasting && <SignMessage />}
    </>
  );
};
