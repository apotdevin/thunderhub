import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useAccount } from '../../context/AccountContext';
import { SingleLine, Sub4Title, Card } from '../../components/generic/Styled';
import { saveSessionAuth, getAuthObj } from '../../utils/auth';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { Input } from '../../components/input/Input';
import { Section } from '../../components/section/Section';
import { Title } from '../../components/typography/Styled';
import { inverseTextColor, mediaWidths } from '../../styles/Themes';
import { useGetCanConnectLazyQuery } from '../../generated/graphql';
import { useStatusDispatch } from '../../context/StatusContext';

const StyledTitle = styled(Title)`
  font-size: 24px;
  color: ${inverseTextColor};

  @media (${mediaWidths.mobile}) {
    font-size: 18px;
  }
`;

export const SessionLogin = () => {
  const { name, host, admin, cert, refreshAccount } = useAccount();
  const [pass, setPass] = useState('');
  const dispatch = useStatusDispatch();

  const [getCanConnect, { data, loading }] = useGetCanConnectLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => {
      toast.error('Unable to connect to this node');
      dispatch({ type: 'disconnected' });
    },
  });

  useEffect(() => {
    if (!loading && data?.getNodeInfo) {
      const bytes = CryptoJS.AES.decrypt(admin, pass);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      saveSessionAuth(decrypted);
      refreshAccount();
      dispatch({ type: 'connected' });
    }
  }, [data, loading, admin, dispatch, pass, refreshAccount]);

  const handleClick = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(admin, pass);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      getCanConnect({
        variables: { auth: getAuthObj(host, decrypted, undefined, cert) },
      });
    } catch (error) {
      toast.error('Wrong Password');
    }
  };

  return (
    <Section withColor={false}>
      <StyledTitle>{`Please Login (${name}):`}</StyledTitle>
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
          loading={loading}
        >
          Connect
        </ColorButton>
      </Card>
    </Section>
  );
};
