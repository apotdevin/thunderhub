import React, { useState } from 'react';
import {
  SubCard,
  Separation,
  SingleLine,
  DarkSubTitle,
  ResponsiveLine,
  NoWrapTitle,
} from '../../components/generic/Styled';
import { renderLine } from '../../components/generic/Helpers';
import { MainInfo, NodeTitle, ColLine } from './Fees.style';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_FEES } from '../../graphql/mutation';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { ChevronRight } from '../../components/generic/Icons';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { useSettings } from '../../context/SettingsContext';
import { textColorMap } from '../../styles/Themes';
import { Input } from '../../components/input/Input';
import { AdminSwitch } from '../../components/adminSwitch/AdminSwitch';

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

  const { theme } = useSettings();

  const {
    alias,
    color,
    baseFee,
    feeRate,
    transactionId,
    transactionVout,
  } = channelInfo;

  const [updateFees] = useMutation(UPDATE_FEES, {
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      setIndexOpen(0);
      data.updateFees
        ? toast.success('Channel fees updated')
        : toast.error('Error updating channel fees');
    },
    refetchQueries: ['GetChannelFees'],
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
            <ChevronRight />
          </SecureButton>
        </AdminSwitch>
      </>
    );
  };

  return (
    <SubCard color={color} key={index}>
      <MainInfo onClick={() => handleClick()}>
        <ResponsiveLine>
          <NodeTitle>{alias ? alias : 'Unknown'}</NodeTitle>
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
