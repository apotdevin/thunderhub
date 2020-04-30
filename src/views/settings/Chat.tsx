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
  const { hideFee, hideNonVerified } = useChatState();
  const dispatch = useChatDispatch();

  const renderButton = (title: string, type: string, current: boolean) => (
    <SingleButton
      selected={current}
      onClick={() => {
        type === 'fee'
          ? dispatch({ type: 'hideFee' })
          : dispatch({ type: 'hideNonVerified' });
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
            {renderButton('Hide', 'fee', hideFee)}
            {renderButton('Show', 'fee', !hideFee)}
          </MultiButton>
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>Non-Verified Messages:</Sub4Title>
          <MultiButton>
            {renderButton('Hide', 'nonverified', hideNonVerified)}
            {renderButton('Show', 'nonverified', !hideNonVerified)}
          </MultiButton>
        </SettingsLine>
      </Card>
    </CardWithTitle>
  );
};
