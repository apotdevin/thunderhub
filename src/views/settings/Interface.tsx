import React from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../../pages/settings';
import { useSettings } from '../../context/SettingsContext';

import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { useAccount } from '../../context/AccountContext';

export const InterfaceSettings = () => {
  const {
    theme,
    currency,
    nodeInfo,
    setSettings,
    refreshSettings,
  } = useSettings();

  const { accounts } = useAccount();

  const viewOnlyAccounts = accounts.filter(account => account.viewOnly !== '');

  const renderButton = (
    title: string,
    value: string,
    type: string,
    current: string
  ) => (
    <SingleButton
      selected={current === value}
      onClick={() => {
        localStorage.setItem(type, value);
        type === 'theme' && setSettings({ theme: value });
        type === 'currency' && setSettings({ currency: value });
        type === 'nodeInfo' &&
          setSettings({ nodeInfo: value === 'true' ? true : false });
        refreshSettings();
      }}
    >
      {title}
    </SingleButton>
  );

  return (
    <CardWithTitle>
      <SubTitle>Interface</SubTitle>
      <Card>
        <SettingsLine>
          <Sub4Title>Theme:</Sub4Title>
          <MultiButton>
            {renderButton('Light', 'light', 'theme', theme)}
            {renderButton('Dark', 'dark', 'theme', theme)}
          </MultiButton>
        </SettingsLine>
        {viewOnlyAccounts.length > 1 && (
          <SettingsLine>
            <Sub4Title>Show all accounts on homepage:</Sub4Title>
            <MultiButton>
              {renderButton('Yes', 'true', 'nodeInfo', `${nodeInfo}`)}
              {renderButton('No', 'false', 'nodeInfo', `${nodeInfo}`)}
            </MultiButton>
          </SettingsLine>
        )}
        <SettingsLine>
          <Sub4Title>Currency:</Sub4Title>
          <MultiButton margin={'0 0 0 16px'}>
            {renderButton('Bitcoin', 'btc', 'currency', currency)}
            {renderButton('Satoshis', 'sat', 'currency', currency)}
            {renderButton('Euro', 'EUR', 'currency', currency)}
            {renderButton('US Dollar', 'USD', 'currency', currency)}
          </MultiButton>
        </SettingsLine>
      </Card>
    </CardWithTitle>
  );
};
