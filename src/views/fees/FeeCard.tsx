import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ChevronRight } from 'react-feather';
import { useUpdateFeesMutation } from 'src/graphql/mutations/__generated__/updateFees.generated';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
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
import { getErrorContent } from '../../utils/error';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { AdminSwitch } from '../../components/adminSwitch/AdminSwitch';

interface FeeCardProps {
  channelInfo: any;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const FeeCard: React.FC<FeeCardProps> = ({
  channelInfo,
  index,
  setIndexOpen,
  indexOpen,
}) => {
  const [newBaseFee, setBaseFee] = useState(0);
  const [newFeeRate, setFeeRate] = useState(0);

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
          <InputWithDeco
            title={'BaseFee'}
            placeholder={'sats'}
            amount={newBaseFee}
            override={'sat'}
            inputType={'number'}
            inputCallback={value => setBaseFee(Number(value))}
          />
          <InputWithDeco
            title={'Fee Rate'}
            placeholder={'sats/million sats'}
            amount={newFeeRate}
            override={'ppm'}
            inputType={'number'}
            inputCallback={value => setFeeRate(Number(value))}
          />
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
                <DarkSubTitle>ppm</DarkSubTitle>
              </SingleLine>
            </SingleLine>
          </ColLine>
        </ResponsiveLine>
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
