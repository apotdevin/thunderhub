import React from 'react';
import styled from 'styled-components';
import { AlertCircle } from 'react-feather';
import { useRouter } from 'next/router';
import {
  useAccountState,
  useAccountDispatch,
  CLIENT_ACCOUNT,
} from 'src/context/AccountContext';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
  Sub4Title,
} from '../../components/generic/Styled';
import { fontColors } from '../../styles/Themes';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { useStatusDispatch } from '../../context/StatusContext';
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
  const { accounts } = useAccountState();

  const clientAccounts = accounts.filter(a => a.type === CLIENT_ACCOUNT);

  const dispatch = useStatusDispatch();
  const chatDispatch = useChatDispatch();
  const dispatchAccount = useAccountDispatch();

  const { push } = useRouter();

  if (clientAccounts.length <= 0) {
    return null;
  }

  const handleDeleteAll = () => {
    dispatch({ type: 'disconnected' });
    chatDispatch({ type: 'disconnected' });
    dispatchAccount({ type: 'deleteAll' });
    push(appendBasePath('/'));
  };

  const renderButton = () => {
    if (clientAccounts.length > 1) {
      return (
        <MultiButton>
          {clientAccounts.map(({ name: accountName, id: accountId }) => {
            return (
              <SingleButton
                key={accountId}
                color={'red'}
                onClick={() => {
                  dispatchAccount({
                    type: 'deleteAccount',
                    changeId: accountId,
                  });
                }}
              >
                {accountName}
              </SingleButton>
            );
          })}
        </MultiButton>
      );
    }
    if (clientAccounts.length === 1) {
      return (
        <ColorButton color={'red'} onClick={handleDeleteAll}>
          {clientAccounts[0].name}
        </ColorButton>
      );
    }
    return null;
  };

  return (
    <CardWithTitle>
      <SubTitle>Danger Zone</SubTitle>
      <OutlineCard>
        <SettingsLine>
          <Sub4Title>Delete Account:</Sub4Title>
          {renderButton()}
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>Delete all Accounts and Settings:</Sub4Title>
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
