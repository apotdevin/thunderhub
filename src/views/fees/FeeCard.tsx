import React, { useState } from 'react';
import { AlertCircle } from 'react-feather';
import { ChannelType } from 'src/graphql/types';
import { formatSats } from 'src/utils/helpers';
import { chartColors } from 'src/styles/Themes';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { ChangeDetails } from 'src/components/modal/changeDetails/ChangeDetails';
import Modal from 'src/components/modal/ReactModal';
import {
  SubCard,
  Separation,
  SingleLine,
  DarkSubTitle,
  ResponsiveLine,
  Sub4Title,
} from '../../components/generic/Styled';
import { renderLine, getWithCopy } from '../../components/generic/helpers';
import { MainInfo, NodeTitle } from '../../components/generic/CardGeneric';
import { WarningText } from '../stats/styles';
import { FeeCardColumn, FeeCardNoWrap } from './styles';

interface FeeCardProps {
  channel: ChannelType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const FeeCard: React.FC<FeeCardProps> = ({
  channel,
  index,
  setIndexOpen,
  indexOpen,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { partner_public_key, partner_node_info, partner_fee_info } = channel;

  const { alias, color } = partner_node_info.node;
  const {
    transaction_id,
    transaction_vout,
    node_policies,
    partner_node_policies,
  } = partner_fee_info?.channel || {};
  const {
    base_fee_mtokens,
    fee_rate,
    cltv_delta,
    max_htlc_mtokens,
    min_htlc_mtokens,
  } = node_policies || {};

  const base_fee = Number(base_fee_mtokens) / 1000;
  const max_htlc = Number(max_htlc_mtokens) / 1000;
  const min_htlc = Number(min_htlc_mtokens) / 1000;

  const handleClick = () => {
    if (indexOpen === index) {
      setIndexOpen(0);
    } else {
      setIndexOpen(index);
    }
  };

  const renderPartnerDetails = () => {
    const {
      base_fee_mtokens,
      fee_rate,
      cltv_delta,
      max_htlc_mtokens,
      min_htlc_mtokens,
    } = partner_node_policies || {};

    const base_fee = Number(base_fee_mtokens) / 1000;
    const max_htlc = Number(max_htlc_mtokens) / 1000;
    const min_htlc = Number(min_htlc_mtokens) / 1000;

    return (
      <>
        <Separation />
        <Sub4Title>Partner Details</Sub4Title>
        {renderLine('Base Fee (sats)', base_fee)}
        {renderLine('Fee Rate (ppm)', fee_rate)}
        {renderLine('CLTV Delta', cltv_delta)}
        {renderLine('Max HTLC (sats)', formatSats(max_htlc))}
        {renderLine('Min HTLC (sats)', formatSats(min_htlc))}
      </>
    );
  };

  const renderDetails = () => {
    return (
      <>
        {renderWarningText(cltv_delta)}
        <ColorButton
          withBorder={true}
          onClick={() => setModalOpen(true)}
          fullWidth={true}
          withMargin={'16px 0 0'}
          arrow={true}
        >
          Update Details
        </ColorButton>
        {renderPartnerDetails()}
        <Separation />
        {renderLine('Transaction Id:', getWithCopy(transaction_id))}
        {renderLine('Transaction Vout:', transaction_vout)}
      </>
    );
  };

  const renderDetail = (title: string, children: JSX.Element) => (
    <SingleLine>
      <FeeCardNoWrap>
        <DarkSubTitle>{title}</DarkSubTitle>
      </FeeCardNoWrap>
      <SingleLine>{children}</SingleLine>
    </SingleLine>
  );

  const renderWarningText = (htlc_delta: number | null | undefined) => {
    if (!htlc_delta) return null;
    if (htlc_delta <= 18) {
      return (
        <>
          <Separation />
          <WarningText warningColor={chartColors.red}>
            You should increase the CLTV delta
          </WarningText>
        </>
      );
    }
    if (htlc_delta <= 34) {
      return (
        <>
          <Separation />
          <WarningText>
            You should consider increasing the CLTV delta
          </WarningText>
        </>
      );
    }
    return null;
  };

  const renderWarning = (htlc_delta: number | null | undefined) => {
    if (!htlc_delta) return null;
    if (htlc_delta <= 14) {
      return <AlertCircle size={14} color={chartColors.red} />;
    }
    if (htlc_delta <= 24) {
      return <AlertCircle size={14} color={chartColors.orange} />;
    }
    return null;
  };

  return (
    <SubCard subColor={color} key={index}>
      <MainInfo onClick={() => handleClick()}>
        <ResponsiveLine>
          <NodeTitle>{alias || partner_public_key?.substring(0, 6)}</NodeTitle>
          <FeeCardColumn>
            {renderDetail(
              'Base Fee:',
              <>
                {base_fee}
                <DarkSubTitle>{base_fee === 1 ? 'sat' : 'sats'}</DarkSubTitle>
              </>
            )}
            {renderDetail(
              'Fee Rate:',
              <>
                {fee_rate}
                <DarkSubTitle>ppm</DarkSubTitle>
              </>
            )}
            {renderDetail(
              'CLTV Delta:',
              <>
                {cltv_delta}
                {renderWarning(cltv_delta)}
              </>
            )}
            {renderDetail(
              'Max HTLC:',
              <>
                {formatSats(max_htlc)}
                <DarkSubTitle>{max_htlc === 1 ? 'sat' : 'sats'}</DarkSubTitle>
              </>
            )}
            {renderDetail(
              'Min HTLC:',
              <>
                {formatSats(min_htlc)}
                <DarkSubTitle>{min_htlc === 1 ? 'sat' : 'sats'}</DarkSubTitle>
              </>
            )}
          </FeeCardColumn>
        </ResponsiveLine>
      </MainInfo>
      {index === indexOpen && renderDetails()}
      <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
        <ChangeDetails
          callback={() => setModalOpen(false)}
          transaction_id={transaction_id}
          transaction_vout={transaction_vout}
          base_fee_mtokens={base_fee_mtokens}
          max_htlc_mtokens={max_htlc_mtokens}
          min_htlc_mtokens={min_htlc_mtokens}
          fee_rate={fee_rate}
          cltv_delta={cltv_delta}
        />
      </Modal>
    </SubCard>
  );
};
