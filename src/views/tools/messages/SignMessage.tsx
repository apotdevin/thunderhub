import React, { useState, useEffect } from 'react';
import { useAccount } from '../../../context/AccountContext';
import { useLazyQuery } from '@apollo/react-hooks';
import { SIGN_MESSAGE } from '../../../graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import {
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
import { XSvg, Copy } from '../../../components/generic/Icons';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { NoWrap } from './Messages';
import { Input } from '../../../components/input/Input';
import { SecureButton } from '../../../components/buttons/secureButton/SecureButton';
import CopyToClipboard from 'react-copy-to-clipboard';
import { AdminSwitch } from '../../../components/adminSwitch/AdminSwitch';
import { Column, WrapRequest } from '../Tools.styled';

export const SignMessage = () => {
  const [message, setMessage] = useState<string>('');
  const [isPasting, setIsPasting] = useState<boolean>(false);
  const [signed, setSigned] = useState<string>('');

  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const [signMessage, { data, loading }] = useLazyQuery(SIGN_MESSAGE, {
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
      <SecureButton
        callback={signMessage}
        variables={{ auth, message }}
        fullWidth={true}
        withMargin={'8px 0 4px'}
        disabled={message === ''}
        loading={loading}
      >
        Sign
      </SecureButton>
      <Separation />
    </>
  );

  const renderMessage = () => (
    <Column>
      <WrapRequest>{signed}</WrapRequest>
      <CopyToClipboard
        text={signed}
        onCopy={() => toast.success('Signature Copied')}
      >
        <ColorButton>
          <Copy />
          Copy
        </ColorButton>
      </CopyToClipboard>
    </Column>
  );

  return (
    <AdminSwitch>
      <SingleLine>
        <DarkSubTitle>Sign Message</DarkSubTitle>
        <ColorButton
          withMargin={'4px 0'}
          disabled={loading}
          arrow={!isPasting}
          onClick={() => setIsPasting(prev => !prev)}
        >
          {isPasting ? <XSvg /> : 'Sign'}
        </ColorButton>
      </SingleLine>
      {isPasting && renderInput()}
      {signed !== '' && isPasting && renderMessage()}
    </AdminSwitch>
  );
};
