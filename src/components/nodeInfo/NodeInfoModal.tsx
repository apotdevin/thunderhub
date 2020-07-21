import React from 'react';
import { useAccountDispatch } from 'src/context/AccountContext';
import { GetNodeInfoQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { NodeInfoType, ChannelBalanceType } from 'src/graphql/types';
import {
  SubTitle,
  SingleLine,
  DarkSubTitle,
  Sub4Title,
  Separation,
} from '../generic/Styled';
import { Price } from '../price/Price';
import { ColorButton } from '../buttons/colorButton/ColorButton';
import { useStatusDispatch } from '../../context/StatusContext';

interface NodeInfoModalProps {
  account: GetNodeInfoQuery | null | undefined;
  accountId: string;
}

export const NodeInfoModal = ({ account, accountId }: NodeInfoModalProps) => {
  const dispatch = useStatusDispatch();

  const dispatchAccount = useAccountDispatch();

  if (!account) {
    return null;
  }

  const {
    active_channels_count,
    closed_channels_count,
    alias,
    pending_channels_count,
    is_synced_to_chain,
    peers_count,
    version,
  } = account.getNodeInfo as NodeInfoType;

  const {
    confirmedBalance,
    pendingBalance,
  } = account.getChannelBalance as ChannelBalanceType;

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
          dispatch({
            type: 'disconnected',
          });
          dispatchAccount({ type: 'changeAccount', changeId: accountId });
        }}
      >
        Change to this Account
      </ColorButton>
    </>
  );
};
