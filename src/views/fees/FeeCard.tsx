import React, { useState } from 'react';
import {
  SubCard,
  Separation,
  SingleLine,
  DarkSubTitle,
  ResponsiveLine,
  NoWrapTitle,
} from '../../components/generic/Styled';
import { renderLine } from '../../components/generic/helpers';
import {
  MainInfo,
  NodeTitle,
  ColLine,
} from '../../components/generic/CardGeneric';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { ChevronRight } from 'react-feather';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { useConfigState } from '../../context/ConfigContext';
import { textColorMap } from '../../styles/Themes';
import { Input } from '../../components/input/Input';
import { AdminSwitch } from '../../components/adminSwitch/AdminSwitch';
import { useUpdateFeesMutation } from '../../generated/graphql';

interface FeeCardProps {
  channelInfo: any;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const FeeCard = ({
  channelInfo,
  index,
  setIndexOpen,
  indexOpen,
}: FeeCardProps) => {
  const [newBaseFee, setBaseFee] = useState(0);
  const [newFeeRate, setFeeRate] = useState(0);

  const { theme } = useConfigState();

  const {
    alias,
    color,
    baseFee,
    feeRate,
    transactionId,
    transactionVout,
    public_key,
  } = channelInfo;

  const [updateFees] = useUpdateFeesMutation({
    onError: error => toast.error(getErrorContent(error)),
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

  const renderDetails = () => {
    return (
      <>
        <Separation />
        {renderLine('Transaction Id:', transactionId)}
        {renderLine('Transaction Vout:', transactionVout)}
        <Separation />
        <AdminSwitch>
          <ResponsiveLine>
            <NoWrapTitle>
              <DarkSubTitle>{'Base Fee:'}</DarkSubTitle>
            </NoWrapTitle>
            <Input
              placeholder={'Sats'}
              color={textColorMap[theme]}
              type={textColorMap[theme]}
              onChange={e => setBaseFee(Number(e.target.value))}
            />
          </ResponsiveLine>
          <ResponsiveLine>
            <NoWrapTitle>
              <DarkSubTitle>{'Fee Rate:'}</DarkSubTitle>
            </NoWrapTitle>
            <Input
              placeholder={'Sats/Million'}
              color={textColorMap[theme]}
              type={'number'}
              onChange={e => setFeeRate(Number(e.target.value))}
            />
          </ResponsiveLine>
          <SecureButton
            callback={updateFees}
            variables={{
              transactionId,
              transactionVout,
              ...(newBaseFee !== 0 && {
                baseFee: newBaseFee,
              }),
              ...(newFeeRate !== 0 && {
                feeRate: newFeeRate,
              }),
            }}
            color={textColorMap[theme]}
            disabled={newBaseFee === 0 && newFeeRate === 0}
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

  return (
    <SubCard color={color} key={index}>
      <MainInfo onClick={() => handleClick()}>
        <ResponsiveLine>
          <NodeTitle>{alias || public_key?.substring(0, 6)}</NodeTitle>
          <ColLine>
            <SingleLine>
              <NoWrapTitle>
                <DarkSubTitle>{'Base Fee:'}</DarkSubTitle>
              </NoWrapTitle>
              <SingleLine>
                {baseFee}
                <DarkSubTitle>{baseFee === 1 ? 'sat' : 'sats'}</DarkSubTitle>
              </SingleLine>
            </SingleLine>
            <SingleLine>
              <NoWrapTitle>
                <DarkSubTitle>{'Fee Rate:'}</DarkSubTitle>
              </NoWrapTitle>
              <SingleLine>
                {feeRate}
                <DarkSubTitle>
                  {feeRate === 1 ? 'sat/million' : 'sats/million'}
                </DarkSubTitle>
              </SingleLine>
            </SingleLine>
          </ColLine>
        </ResponsiveLine>
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
