import React from 'react';
import styled from 'styled-components';
import { AlertCircle } from 'react-feather';
import { useRouter } from 'next/router';
import { useLogoutMutation } from 'src/graphql/mutations/__generated__/logout.generated';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
  Sub4Title,
} from '../../components/generic/Styled';
import { fontColors } from '../../styles/Themes';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { appendBasePath } from '../../utils/basePath';
import { useChatDispatch } from '../../context/ChatContext';

export const ButtonRow = styled.div`
  width: auto;
  display: flex;
`;

const OutlineCard = styled(Card)`
  &:hover {
    border: 1px solid red;
  }
`;

export const SettingsLine = styled(SingleLine)`
  margin: 10px 0;
`;

export const CheckboxText = styled.div`
  font-size: 13px;
  color: ${fontColors.grey7};
  text-align: justify;
`;

export const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

export const FixedWidth = styled.div`
  height: 18px;
  width: 18px;
  margin: 0px;
  margin-right: 8px;
`;

export const DangerView = () => {
  const chatDispatch = useChatDispatch();

  const { push } = useRouter();

  const [logout] = useLogoutMutation({
    onCompleted: () => push(appendBasePath('/')),
  });

  const handleDeleteAll = () => {
    chatDispatch({ type: 'disconnected' });
    localStorage.clear();
    sessionStorage.clear();

    logout();
  };

  return (
    <CardWithTitle>
      <SubTitle>Danger Zone</SubTitle>
      <OutlineCard>
        <SettingsLine>
          <Sub4Title>Delete all accounts, chats and settings:</Sub4Title>
          <ButtonRow>
            <ColorButton color={'red'} onClick={handleDeleteAll}>
              Delete All
            </ColorButton>
          </ButtonRow>
        </SettingsLine>
        <StyledContainer>
          <FixedWidth>
            <AlertCircle size={18} color={fontColors.grey7} />
          </FixedWidth>
          <CheckboxText>
            This does not affect in any way your node, only the ThunderHub
            accounts saved in this browser.
          </CheckboxText>
        </StyledContainer>
      </OutlineCard>
    </CardWithTitle>
  );
};
