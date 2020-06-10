import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  useAccountState,
  useAccountDispatch,
  CLIENT_ACCOUNT,
  SERVER_ACCOUNT,
} from 'src/context/AccountContext';
import { useRouter } from 'next/router';
import { appendBasePath } from 'src/utils/basePath';
import { useGetCanConnectLazyQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { useGetSessionTokenLazyQuery } from 'src/graphql/queries/__generated__/getSessionToken.generated';
import { getAuthFromAccount } from 'src/context/helpers/context';
import { getErrorContent } from 'src/utils/error';
import { Lock } from 'react-feather';
import { SingleLine, Sub4Title, Card } from '../../components/generic/Styled';
import { getAuthObj } from '../../utils/auth';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { Input } from '../../components/input/Input';
import { Section } from '../../components/section/Section';
import { Title } from '../../components/typography/Styled';
import {
  inverseTextColor,
  mediaWidths,
  chartColors,
} from '../../styles/Themes';
import { useStatusDispatch } from '../../context/StatusContext';
import { dontShowSessionLogin } from './helpers';

const StyledTitle = styled(Title)`
  font-size: 24px;
  color: ${inverseTextColor};

  @media (${mediaWidths.mobile}) {
    font-size: 18px;
  }
`;

const IconPadding = styled.span`
  margin-left: 4px;
`;

export const SessionLogin = () => {
  const { push } = useRouter();
  const { account } = useAccountState();
  const dispatchAccount = useAccountDispatch();

  const [pass, setPass] = useState('');
  const dispatch = useStatusDispatch();

  const [getCanConnect, { data, loading }] = useGetCanConnectLazyQuery({
    fetchPolicy: 'network-only',
    onError: err => {
      toast.error(getErrorContent(err));
      dispatch({ type: 'disconnected' });
    },
  });

  const [
    getSessionToken,
    { data: sData, loading: sLoading },
  ] = useGetSessionTokenLazyQuery({
    fetchPolicy: 'network-only',
    onError: err => {
      toast.error(getErrorContent(err));
      dispatch({ type: 'disconnected' });
    },
  });

  useEffect(() => {
    if (!sLoading && sData && sData.getSessionToken) {
      getCanConnect({
        variables: {
          auth: getAuthFromAccount(account),
        },
      });
    }
  }, [sLoading, sData, push, getCanConnect, account]);

  useEffect(() => {
    if (
      !loading &&
      data &&
      data.getNodeInfo &&
      account.type === SERVER_ACCOUNT
    ) {
      dispatch({ type: 'connected' });
      push(appendBasePath('/home'));
    }
    if (
      !loading &&
      data &&
      data.getNodeInfo &&
      account.type === CLIENT_ACCOUNT
    ) {
      const bytes = CryptoJS.AES.decrypt(account.admin, pass);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      dispatchAccount({ type: 'addSession', session: decrypted });
      dispatch({ type: 'connected' });
      push(appendBasePath('/home'));
    }
  }, [data, loading, dispatch, pass, account, dispatchAccount, push]);

  if (dontShowSessionLogin(account)) {
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

  const getTitle = () => {
    if (account.type === CLIENT_ACCOUNT) {
      if (!account.viewOnly) {
        return `Login to ${account.name} (admin-only):`;
      }
    }
    if (account.type === SERVER_ACCOUNT) {
      return (
        <>
          {`Login to ${account.name}`}
          <IconPadding>
            <Lock size={18} color={chartColors.green} />
          </IconPadding>
        </>
      );
    }
    return `Login to ${account.name}`;
  };

  return (
    <Section withColor={false}>
      <StyledTitle>{getTitle()}</StyledTitle>
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
