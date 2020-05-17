import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  useAccountState,
  useAccountDispatch,
  CLIENT_ACCOUNT,
  SSO_ACCOUNT,
  SERVER_ACCOUNT,
} from 'src/context/AccountContext';
import { useRouter } from 'next/router';
import { appendBasePath } from 'src/utils/basePath';
import Cookies from 'js-cookie';
import { useGetCanConnectLazyQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { useGetSessionTokenLazyQuery } from 'src/graphql/queries/__generated__/getSessionToken.generated';
import { SingleLine, Sub4Title, Card } from '../../components/generic/Styled';
import { getAuthObj } from '../../utils/auth';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { Input } from '../../components/input/Input';
import { Section } from '../../components/section/Section';
import { Title } from '../../components/typography/Styled';
import { inverseTextColor, mediaWidths } from '../../styles/Themes';
import { useStatusDispatch } from '../../context/StatusContext';

const StyledTitle = styled(Title)`
  font-size: 24px;
  color: ${inverseTextColor};

  @media (${mediaWidths.mobile}) {
    font-size: 18px;
  }
`;

export const SessionLogin = () => {
  const { push } = useRouter();
  const { account } = useAccountState();
  const dispatchAccount = useAccountDispatch();

  const [pass, setPass] = useState('');
  const dispatch = useStatusDispatch();

  const [getCanConnect, { data, loading }] = useGetCanConnectLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => {
      toast.error('Unable to connect to this node');
      dispatch({ type: 'disconnected' });
    },
  });

  const [
    getSessionToken,
    { data: sData, loading: sLoading },
  ] = useGetSessionTokenLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => {
      toast.error('Wrong password');
      dispatch({ type: 'disconnected' });
    },
  });

  useEffect(() => {
    if (!sLoading && sData?.getSessionToken) {
      Cookies.set('AccountAuth', sData.getSessionToken, {
        sameSite: 'strict',
      });
      getCanConnect({
        variables: {
          auth: { type: SERVER_ACCOUNT },
        },
      });
    }
  }, [sLoading, sData, push, getCanConnect]);

  useEffect(() => {
    if (!loading && data?.getNodeInfo && account.type === SERVER_ACCOUNT) {
      dispatch({ type: 'connected' });
      push(appendBasePath('/home'));
    }
    if (!loading && data?.getNodeInfo && account.type === CLIENT_ACCOUNT) {
      const bytes = CryptoJS.AES.decrypt(account.admin, pass);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      dispatchAccount({ type: 'addSession', session: decrypted });
      dispatch({ type: 'connected' });
      push(appendBasePath('/home'));
    }
  }, [data, loading, dispatch, pass, account, dispatchAccount, push]);

  if (!account || account?.type === SSO_ACCOUNT) {
    return null;
  }

  if (account?.type !== CLIENT_ACCOUNT && account.loggedIn) {
    return null;
  }

  const handleClick = () => {
    if (account.type === CLIENT_ACCOUNT) {
      try {
        const bytes = CryptoJS.AES.decrypt(account.admin, pass);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        getCanConnect({
          variables: {
            auth: getAuthObj(account.host, decrypted, null, account.cert),
          },
        });
      } catch (error) {
        toast.error('Wrong Password');
      }
    } else {
      getSessionToken({ variables: { id: account.id, password: pass } });
    }
  };

  return (
    <Section withColor={false}>
      <StyledTitle>{`Please Login (${account.name}):`}</StyledTitle>
      <Card cardPadding={'32px'} mobileCardPadding={'16px'}>
        <SingleLine>
          <Sub4Title>Password:</Sub4Title>
          <Input
            type={'password'}
            withMargin={'0 0 0 16px'}
            onChange={e => setPass(e.target.value)}
          />
        </SingleLine>
        <ColorButton
          disabled={pass === '' || loading}
          onClick={handleClick}
          withMargin={'16px 0 0'}
          fullWidth={true}
          loading={loading || sLoading}
        >
          Connect
        </ColorButton>
      </Card>
    </Section>
  );
};
