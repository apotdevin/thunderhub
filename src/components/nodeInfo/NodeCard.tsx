import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import 'intersection-observer'; // Polyfill
import { useQuery } from '@apollo/react-hooks';
import { SingleLine, DarkSubTitle, ResponsiveLine } from '../generic/Styled';
import { themeColors } from '../../styles/Themes';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { Price } from '../price/Price';
import Modal from '../modal/ReactModal';
import { StatusDot, StatusLine, QuickCard } from './NodeInfo.styled';
import { NodeInfoModal } from './NodeInfoModal';
import { GET_NODE_INFO } from '../../graphql/query';

export const getStatusDot = (status: boolean) => {
  return status ? <StatusDot color="#95de64" /> : <StatusDot color="#ff4d4f" />;
};

interface NodeCardProps {
  account: any;
  accountId: string;
}

interface QueryData {
  getNodeInfo: {
    active_channels_count: number;
    closed_channels_count: number;
    alias: string;
    pending_channels_count: number;
    is_synced_to_chain: boolean;
  };
  getChannelBalance: {
    confirmedBalance: number;
    pendingBalance: number;
  };
  getChainBalance: number;
  getPendingChainBalance: number;
}

export const NodeCard = ({ account, accountId }: NodeCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { host, viewOnly, cert } = account;
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const auth = {
    host,
    macaroon: viewOnly,
    cert,
  };

  const { data, loading, error } = useQuery<QueryData>(GET_NODE_INFO, {
    variables: { auth },
    skip: !inView,
    pollInterval: 10000,
  });

  if (error) {
    return null;
  }

  const renderContent = () => {
    if (!inView) {
      return (
        <>
          <StatusLine>{getStatusDot(false)}</StatusLine>
          <div>-</div>
          <SingleLine>
            <DarkSubTitle>Lightning</DarkSubTitle>
            <div>-</div>
          </SingleLine>
          <SingleLine>
            <DarkSubTitle>Bitcoin</DarkSubTitle>
            <div>-</div>
          </SingleLine>
          <SingleLine>
            <DarkSubTitle>Channels</DarkSubTitle>
            <div>-</div>
          </SingleLine>
        </>
      );
    }
    if (loading || !data || !data.getNodeInfo || !data.getChannelBalance) {
      return <ScaleLoader height={20} color={themeColors.blue3} />;
    }

    const {
      active_channels_count: active,
      closed_channels_count: closed,
      alias,
      pending_channels_count: pending,
      is_synced_to_chain,
    } = data.getNodeInfo;

    const { confirmedBalance, pendingBalance } = data.getChannelBalance;

    const chainBalance = data.getChainBalance;
    const pendingChainBalance = data.getPendingChainBalance;

    return (
      <>
        <StatusLine>{getStatusDot(is_synced_to_chain)}</StatusLine>
        <div>{alias}</div>
        <ResponsiveLine>
          <DarkSubTitle>Lightning</DarkSubTitle>
          <Price amount={confirmedBalance + pendingBalance} />
        </ResponsiveLine>
        <ResponsiveLine>
          <DarkSubTitle>Bitcoin</DarkSubTitle>
          <Price amount={chainBalance + pendingChainBalance} />
        </ResponsiveLine>
        <ResponsiveLine>
          <DarkSubTitle>Channels</DarkSubTitle>
          <div>{`${active} / ${pending} / ${closed}`}</div>
        </ResponsiveLine>
      </>
    );
  };

  return (
    <>
      <QuickCard
        onClick={() => {
          setIsOpen(true);
        }}
        ref={ref}
        key={account.id}
      >
        {renderContent()}
      </QuickCard>
      <Modal
        isOpen={isOpen}
        closeCallback={() => {
          setIsOpen(false);
        }}
      >
        <NodeInfoModal
          account={{
            ...data,
          }}
          accountId={accountId}
        />
      </Modal>
    </>
  );
};
