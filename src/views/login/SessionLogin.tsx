import React, { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import { SingleLine, Sub4Title, Card } from '../../components/generic/Styled';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import { saveSessionAuth } from '../../utils/auth';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { Input } from '../../components/input/Input';
import { Section } from '../../components/section/Section';
import { Title } from '../../components/typography/Styled';
import styled from 'styled-components';
import { textColor } from '../../styles/Themes';

const StyledTitle = styled(Title)`
  font-size: 28px;
  color: ${textColor};
`;

export const SessionLogin = () => {
  const { name, admin, refreshAccount } = useAccount();
  const [pass, setPass] = useState('');

  const handleClick = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(admin, pass);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      saveSessionAuth(decrypted);
      refreshAccount();
    } catch (error) {
      toast.error('Wrong Password');
    }
  };

  return (
    <Section padding={'36px 0'}>
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
          disabled={pass === ''}
          onClick={handleClick}
          withMargin={'16px 0 0'}
          fullWidth={true}
          arrow={true}
        >
          Connect
        </ColorButton>
      </Card>
    </Section>
  );
};
