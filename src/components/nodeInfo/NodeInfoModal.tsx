import React from 'react';
import {
  SubTitle,
  SingleLine,
  DarkSubTitle,
  Sub4Title,
  Separation,
} from '../generic/Styled';
import { Price } from '../price/Price';
import { ColorButton } from '../buttons/colorButton/ColorButton';
import { useConnectionDispatch } from '../../context/ConnectionContext';
import { useStatusDispatch } from '../../context/StatusContext';
import { useAccount } from '../../context/AccountContext';

interface NodeInfoModalProps {
  account: any;
  accountId: string;
}

export const NodeInfoModal = ({ account, accountId }: NodeInfoModalProps) => {
  const dispatch = useConnectionDispatch();
  const dispatchState = useStatusDispatch();

  const { changeAccount } = useAccount();

  const {
    active_channels_count,
    closed_channels_count,
    alias,
    pending_channels_count,
    is_synced_to_chain,
    peers_count,
    version,
  } = account.getNodeInfo;

  const { confirmedBalance, pendingBalance } = account.getChannelBalance;

  const chainBalance = account.getChainBalance;
  const pendingChainBalance = account.getPendingChainBalance;

  return (
    <>
      <SubTitle>{alias}</SubTitle>
      <Separation />
      <SingleLine>
        <DarkSubTitle>Version:</DarkSubTitle>
        <div>{version.split(' ')[0]}</div>
      </SingleLine>
      <SingleLine>
        <DarkSubTitle>Is Synced:</DarkSubTitle>
        <div>{is_synced_to_chain ? 'True' : 'False'}</div>
      </SingleLine>
      <SingleLine>
        <DarkSubTitle>Peer Count:</DarkSubTitle>
        <div>{peers_count}</div>
      </SingleLine>
      <SingleLine>
        <DarkSubTitle>Active Channels:</DarkSubTitle>
        <div>{active_channels_count}</div>
      </SingleLine>
      <SingleLine>
        <DarkSubTitle>Pending Channels:</DarkSubTitle>
        <div>{pending_channels_count}</div>
      </SingleLine>
      <SingleLine>
        <DarkSubTitle>Closed Channels:</DarkSubTitle>
        <div>{closed_channels_count}</div>
      </SingleLine>
      <Sub4Title>Lightning</Sub4Title>
      <SingleLine>
        <DarkSubTitle>Balance:</DarkSubTitle>
        <Price amount={confirmedBalance} />
      </SingleLine>
      <SingleLine>
        <DarkSubTitle>Pending:</DarkSubTitle>
        <Price amount={pendingBalance} />
      </SingleLine>
      <Sub4Title>Bitcoin</Sub4Title>
      <SingleLine>
        <DarkSubTitle>Balance:</DarkSubTitle>
        <Price amount={chainBalance} />
      </SingleLine>
      <SingleLine>
        <DarkSubTitle>Pending:</DarkSubTitle>
        <Price amount={pendingChainBalance} />
      </SingleLine>
      <ColorButton
        withMargin={'16px 0 0'}
        fullWidth={true}
        onClick={() => {
          dispatch({ type: 'disconnected' });
          dispatchState({
            type: 'disconnected',
          });
          changeAccount(accountId);
        }}
      >
        Change to this Account
      </ColorButton>
    </>
  );
};
