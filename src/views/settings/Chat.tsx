import React from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../../pages/settings';

import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { useChatState, useChatDispatch } from '../../context/ChatContext';

export const ChatSettings = () => {
  const {
    hideFee,
    hideNonVerified,
    maxFee,
    chatPollingSpeed: cps,
  } = useChatState();
  const dispatch = useChatDispatch();

  const renderButton = (
    title: string,
    type: string,
    current: boolean,
    value: boolean | number
  ) => (
    <SingleButton
      selected={current}
      onClick={() => {
        switch (type) {
          case 'fee':
            typeof value === 'boolean' &&
              dispatch({ type: 'hideFee', hideFee: value });
            break;
          case 'nonverified':
            typeof value === 'boolean' &&
              dispatch({ type: 'hideNonVerified', hideNonVerified: value });
            break;
          case 'pollingSpeed':
            typeof value === 'number' &&
              dispatch({ type: 'pollingSpeed', chatPollingSpeed: value });
            break;
          default:
            typeof value === 'number' &&
              dispatch({ type: 'changeFee', maxFee: value });
            break;
        }
      }}
    >
      {title}
    </SingleButton>
  );

  return (
    <CardWithTitle>
      <SubTitle>Chat</SubTitle>
      <Card>
        <SettingsLine>
          <Sub4Title>Fee:</Sub4Title>
          <MultiButton>
            {renderButton('Hide', 'fee', hideFee, true)}
            {renderButton('Show', 'fee', !hideFee, false)}
          </MultiButton>
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>Non-Verified Messages:</Sub4Title>
          <MultiButton>
            {renderButton('Hide', 'nonverified', hideNonVerified, true)}
            {renderButton('Show', 'nonverified', !hideNonVerified, false)}
          </MultiButton>
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>{'Max Fee (sats):'}</Sub4Title>
          <MultiButton>
            {renderButton('10', 'maxFee', maxFee === 10, 10)}
            {renderButton('20', 'maxFee', maxFee === 20, 20)}
            {renderButton('30', 'maxFee', maxFee === 30, 30)}
            {renderButton('50', 'maxFee', maxFee === 50, 50)}
            {renderButton('100', 'maxFee', maxFee === 100, 100)}
          </MultiButton>
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>{'Polling Speed:'}</Sub4Title>
          <MultiButton>
            {renderButton('1s', 'pollingSpeed', cps === 1000, 1000)}
            {renderButton('10s', 'pollingSpeed', cps === 10000, 10000)}
            {renderButton('1m', 'pollingSpeed', cps === 60000, 60000)}
            {renderButton('10m', 'pollingSpeed', cps === 600000, 600000)}
            {renderButton('None', 'pollingSpeed', cps === 0, 0)}
          </MultiButton>
        </SettingsLine>
      </Card>
    </CardWithTitle>
  );
};
