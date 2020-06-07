import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import 'intersection-observer'; // Polyfill
import ScaleLoader from 'react-spinners/ScaleLoader';
import { useGetNodeInfoQuery } from 'src/graphql/queries/__generated__/getNodeInfo.generated';
import { AccountType } from 'src/context/AccountContext';
import { SingleLine, DarkSubTitle, ResponsiveLine } from '../generic/Styled';
import { themeColors } from '../../styles/Themes';
import { Price } from '../price/Price';
import Modal from '../modal/ReactModal';
import { getAuthObj } from '../../utils/auth';
import { StatusDot, StatusLine, QuickCard } from './NodeInfo.styled';
import { NodeInfoModal } from './NodeInfoModal';

export const getStatusDot = (status: boolean) => {
  return status ? <StatusDot color="#95de64" /> : <StatusDot color="#ff4d4f" />;
};

interface NodeCardProps {
  account: AccountType;
  accountId: string;
}

export const NodeCard = ({ account, accountId }: NodeCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { host, viewOnly, cert } = account;
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const auth = getAuthObj(host, viewOnly, null, cert);

  const { data, loading, error } = useGetNodeInfoQuery({
    ssr: false,
    skip: !inView || !auth,
    variables: { auth },
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
        <NodeInfoModal account={data} accountId={accountId} />
      </Modal>
    </>
  );
};
