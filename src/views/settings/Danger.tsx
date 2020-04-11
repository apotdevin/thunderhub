import React from 'react';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
  SimpleButton,
  Sub4Title,
} from '../../components/generic/Styled';
import { deleteStorage, deleteAccountPermissions } from '../../utils/storage';
import { useAccount } from '../../context/AccountContext';
import styled from 'styled-components';
import { textColor, fontColors } from '../../styles/Themes';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { AlertCircle } from '../../components/generic/Icons';
import { useConnectionDispatch } from '../../context/ConnectionContext';
import { useStatusDispatch } from '../../context/StatusContext';
import { useRouter } from 'next/router';

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

export const SettingsButton = styled(SimpleButton)`
  padding: 10px;

  &:hover {
    border: 1px solid ${textColor};
  }
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
  const {
    deleteAccount,
    refreshAccount,
    changeAccount,
    accounts,
    admin,
    viewOnly,
    id,
  } = useAccount();

  const dispatch = useConnectionDispatch();
  const dispatchState = useStatusDispatch();

  const { push } = useRouter();

  const renderButton = () => {
    if (accounts.length > 1) {
      return (
        <MultiButton>
          {accounts.map(({ name: accountName, id: accountId }) => {
            return (
              <SingleButton
                key={accountId}
                color={'red'}
                onClick={() => {
                  deleteAccount(accountId);
                }}
              >
                {accountName}
              </SingleButton>
            );
          })}
        </MultiButton>
      );
    }
    if (accounts.length === 1) {
      return (
        <ColorButton
          color={'red'}
          onClick={() => {
            deleteAccount(accounts[0].id);
          }}
        >
          {accounts[0].name}
        </ColorButton>
      );
    }
    return null;
  };

  const handleDelete = (admin?: boolean) => {
    deleteAccountPermissions(id, accounts, admin);
    dispatch({ type: 'disconnected' });
    dispatchState({
      type: 'disconnected',
    });
    changeAccount(id);
    push('/');
  };

  const renderSwitch = () => {
    return (
      <SettingsLine>
        <Sub4Title>Change Permissions</Sub4Title>
        <MultiButton>
          <SingleButton onClick={() => handleDelete()}>View-Only</SingleButton>
          <SingleButton onClick={() => handleDelete(true)}>
            Admin-Only
          </SingleButton>
        </MultiButton>
      </SettingsLine>
    );
  };

  return (
    <CardWithTitle>
      <SubTitle>Danger Zone</SubTitle>
      <OutlineCard>
        {admin && viewOnly && renderSwitch()}
        <SettingsLine>
          <Sub4Title>Delete Account:</Sub4Title>
          {renderButton()}
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>Delete all Accounts and Settings:</Sub4Title>
          <ButtonRow>
            <ColorButton
              color={'red'}
              onClick={() => {
                deleteStorage();
                refreshAccount();
                push('/');
              }}
            >
              Delete All
            </ColorButton>
          </ButtonRow>
        </SettingsLine>
        <StyledContainer>
          <FixedWidth>
            <AlertCircle color={fontColors.grey7} />
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
