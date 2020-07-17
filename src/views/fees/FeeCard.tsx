import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ChevronRight, AlertCircle } from 'react-feather';
import { useUpdateFeesMutation } from 'src/graphql/mutations/__generated__/updateFees.generated';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { ChannelFeeType } from 'src/graphql/types';
import { formatSats } from 'src/utils/helpers';
import { chartColors } from 'src/styles/Themes';
import { useStatusState } from 'src/context/StatusContext';
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
import { getErrorContent } from '../../utils/error';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { AdminSwitch } from '../../components/adminSwitch/AdminSwitch';
import { WarningText } from '../stats/styles';
import { FeeCardColumn, FeeCardNoWrap } from './styles';

interface FeeCardProps {
  channel: ChannelFeeType;
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
  const { minorVersion, revision } = useStatusState();
  const canMax = (minorVersion === 7 && revision > 1) || minorVersion > 7;
  const canMin = (minorVersion === 8 && revision > 2) || minorVersion > 8;

  const { partner_public_key, partner_node_info, channelInfo } = channel;

  const { alias, color } = partner_node_info.node;
  const {
    transaction_id,
    transaction_vout,
    node_policies,
    partner_node_policies,
  } = channelInfo.channel || {};
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

  const [newBaseFee, setBaseFee] = useState(base_fee);
  const [newFeeRate, setFeeRate] = useState(fee_rate);
  const [newCLTV, setCLTV] = useState(cltv_delta);
  const [newMax, setMax] = useState(max_htlc);
  const [newMin, setMin] = useState(min_htlc);

  const withChanges =
    newBaseFee !== base_fee ||
    newFeeRate !== fee_rate ||
    newCLTV !== cltv_delta ||
    newMax !== max_htlc ||
    newMin !== min_htlc;

  const [updateFees] = useUpdateFeesMutation({
    onError: error => {
      setBaseFee(base_fee);
      setFeeRate(fee_rate);
      setCLTV(cltv_delta);
      setMax(max_htlc);
      setMin(min_htlc);
      toast.error(getErrorContent(error));
    },
    onCompleted: data => {
      setIndexOpen(0);
      data.updateFees
        ? toast.success('Channel fees updated')
        : toast.error('Error updating channel fees');
    },
    refetchQueries: ['ChannelFees'],
  });

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
        {renderPartnerDetails()}
        <Separation />
        {renderLine('Transaction Id:', getWithCopy(transaction_id))}
        {renderLine('Transaction Vout:', transaction_vout)}
        <Separation />
        <AdminSwitch>
          <InputWithDeco
            title={'Base Fee'}
            value={newBaseFee}
            placeholder={'sats'}
            amount={newBaseFee}
            override={'sat'}
            inputType={'number'}
            inputCallback={value => setBaseFee(Number(value))}
          />
          <InputWithDeco
            title={'Fee Rate'}
            placeholder={'ppm'}
            amount={newFeeRate}
            override={'ppm'}
            inputType={'number'}
            inputCallback={value => setFeeRate(Number(value))}
          />
          <InputWithDeco
            title={'CLTV Delta'}
            value={newCLTV}
            placeholder={'cltv delta'}
            customAmount={newCLTV.toString()}
            inputType={'number'}
            inputCallback={value => setCLTV(Number(value))}
          />
          {canMax && (
            <InputWithDeco
              title={'Max HTLC'}
              value={newMax}
              placeholder={'sats'}
              amount={newMax}
              override={'sat'}
              inputType={'number'}
              inputCallback={value => setMax(Number(value))}
            />
          )}
          {canMin && (
            <InputWithDeco
              title={'Min HTLC'}
              value={newMin}
              placeholder={'sats'}
              amount={newMin}
              override={'sat'}
              inputType={'number'}
              inputCallback={value => setMin(Number(value))}
            />
          )}
          <SecureButton
            callback={updateFees}
            variables={{
              transaction_id,
              transaction_vout,
              ...(newBaseFee !== 0 && {
                base_fee_tokens: newBaseFee,
              }),
              ...(newFeeRate !== 0 && {
                fee_rate: newFeeRate,
              }),
              ...(newCLTV !== 0 && { cltv_delta: newCLTV }),
              ...(newMax !== 0 &&
                canMax && { max_htlc_mtokens: (newMax * 1000).toString() }),
              ...(newMin !== 0 &&
                canMin && { min_htlc_mtokens: (newMin * 1000).toString() }),
            }}
            disabled={!withChanges}
            fullWidth={true}
            withMargin={'16px 0 0'}
          >
            Update Fees
            <ChevronRight size={18} />
          </SecureButton>
        </AdminSwitch>
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

  const renderWarningText = (htlc_delta: number) => {
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

  const renderWarning = (htlc_delta: number) => {
    if (htlc_delta <= 14) {
      return <AlertCircle size={14} color={chartColors.red} />;
    }
    if (htlc_delta <= 24) {
      return <AlertCircle size={14} color={chartColors.orange} />;
    }
    return null;
  };

  return (
    <SubCard color={color} key={index}>
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
    </SubCard>
  );
};
