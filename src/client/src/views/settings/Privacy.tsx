import React from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../pages/SettingsPage';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';

import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';

export const PrivacySettings = () => {
  const { fetchFees, fetchPrices, displayValues } = useConfigState();
  const dispatch = useConfigDispatch();

  const renderButton = (
    title: string,
    value: boolean,
    type: string,
    current: boolean
  ) => (
    <SingleButton
      selected={current === value}
      onClick={() => {
        localStorage.setItem(type, JSON.stringify(value));
        dispatch({ type: 'change', [type]: value });
      }}
    >
      {title}
    </SingleButton>
  );

  return (
    <CardWithTitle>
      <SubTitle>Privacy</SubTitle>
      <Card>
        <SettingsLine>
          <Sub4Title>Fetch Bitcoin Fees:</Sub4Title>
          <MultiButton>
            {renderButton('On', true, 'fetchFees', fetchFees)}
            {renderButton('Off', false, 'fetchFees', fetchFees)}
          </MultiButton>
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>Fetch Fiat Prices:</Sub4Title>
          <MultiButton margin={'0 0 0 16px'}>
            {renderButton('On', true, 'fetchPrices', fetchPrices)}
            {renderButton('Off', false, 'fetchPrices', fetchPrices)}
          </MultiButton>
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>Values:</Sub4Title>
          <MultiButton margin={'0 0 0 16px'}>
            {renderButton('Show', true, 'displayValues', displayValues)}
            {renderButton('Hide', false, 'displayValues', displayValues)}
          </MultiButton>
        </SettingsLine>
      </Card>
    </CardWithTitle>
  );
};
