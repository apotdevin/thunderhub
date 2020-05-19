import React from 'react';
import { useAccountState, CLIENT_ACCOUNT } from 'src/context/AccountContext';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../../pages/settings';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';

import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { usePriceState } from '../../context/PriceContext';

export const InterfaceSettings = () => {
  const { dontShow } = usePriceState();
  const { theme, currency, multiNodeInfo } = useConfigState();
  const dispatch = useConfigDispatch();

  const { accounts } = useAccountState();

  const viewOnlyAccounts = accounts.filter(
    account => account.type === CLIENT_ACCOUNT && account.viewOnly !== ''
  );

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
        type === 'theme' && dispatch({ type: 'change', theme: value });
        type === 'currency' && dispatch({ type: 'change', currency: value });
        type === 'nodeInfo' &&
          dispatch({
            type: 'change',
            multiNodeInfo: value === 'true' ? true : false,
          });
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
              {renderButton('Yes', 'true', 'nodeInfo', `${multiNodeInfo}`)}
              {renderButton('No', 'false', 'nodeInfo', `${multiNodeInfo}`)}
            </MultiButton>
          </SettingsLine>
        )}
        <SettingsLine>
          <Sub4Title>Currency:</Sub4Title>
          <MultiButton margin={'0 0 0 16px'}>
            {renderButton('Satoshis', 'sat', 'currency', currency)}
            {renderButton('Bitcoin', 'btc', 'currency', currency)}
            {!dontShow && renderButton('Euro', 'EUR', 'currency', currency)}
            {!dontShow && renderButton('USD', 'USD', 'currency', currency)}
          </MultiButton>
        </SettingsLine>
      </Card>
    </CardWithTitle>
  );
};
