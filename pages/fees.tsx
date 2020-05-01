import React, { useState } from 'react';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
  Sub4Title,
  Separation,
  DarkSubTitle,
  RightAlign,
  ResponsiveLine,
  NoWrapTitle,
} from '../src/components/generic/Styled';
import { useAccount } from '../src/context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../src/utils/error';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { FeeCard } from '../src/views/fees/FeeCard';
import { ChevronRight, X } from 'react-feather';
import { SecureButton } from '../src/components/buttons/secureButton/SecureButton';
import { AdminSwitch } from '../src/components/adminSwitch/AdminSwitch';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';
import { Input } from '../src/components/input/Input';
import {
  useChannelFeesQuery,
  useUpdateFeesMutation,
} from '../src/generated/graphql';

const FeesView = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [baseFee, setBaseFee] = useState(0);
  const [feeRate, setFeeRate] = useState(0);

  const { auth } = useAccount();

  const { loading, data } = useChannelFeesQuery({
    skip: !auth,
    variables: { auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  const [updateFees] = useUpdateFeesMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      setIsEdit(false);
      data.updateFees
        ? toast.success('Fees Updated')
        : toast.error('Error updating fees');
    },
    refetchQueries: ['GetChannelFees'],
  });

  if (loading || !data || !data.getChannelFees) {
    return <LoadingCard title={'Fees'} />;
  }

  return (
    <>
      <AdminSwitch>
        <CardWithTitle>
          <SubTitle>Update Channel Fees</SubTitle>
          <Card>
            <SingleLine>
              <Sub4Title>Channel Fees</Sub4Title>
              <ColorButton onClick={() => setIsEdit(prev => !prev)}>
                {isEdit ? <X size={18} /> : 'Update'}
              </ColorButton>
            </SingleLine>
            {isEdit && (
              <>
                <Separation />
                <ResponsiveLine>
                  <NoWrapTitle>
                    <DarkSubTitle>{'Base Fee:'}</DarkSubTitle>
                  </NoWrapTitle>
                  <Input
                    placeholder={'Sats'}
                    type={'number'}
                    onChange={e => setBaseFee(Number(e.target.value))}
                  />
                </ResponsiveLine>
                <ResponsiveLine>
                  <NoWrapTitle>
                    <DarkSubTitle>{'Fee Rate:'}</DarkSubTitle>
                  </NoWrapTitle>
                  <Input
                    placeholder={'Sats/Million'}
                    type={'number'}
                    onChange={e => setFeeRate(Number(e.target.value))}
                  />
                </ResponsiveLine>
                <RightAlign>
                  <SecureButton
                    callback={updateFees}
                    variables={{
                      ...(baseFee !== 0 && { baseFee }),
                      ...(feeRate !== 0 && { feeRate }),
                    }}
                    disabled={baseFee === 0 && feeRate === 0}
                    fullWidth={true}
                    withMargin={'16px 0 0'}
                  >
                    Update Fees
                    <ChevronRight size={18} />
                  </SecureButton>
                </RightAlign>
              </>
            )}
          </Card>
        </CardWithTitle>
      </AdminSwitch>
      <CardWithTitle>
        <SubTitle>Channel Fees</SubTitle>
        <Card>
          {data.getChannelFees.map((channel: any, index: number) => (
            <FeeCard
              channelInfo={channel}
              index={index + 1}
              setIndexOpen={setIndexOpen}
              indexOpen={indexOpen}
              key={index}
            />
          ))}
        </Card>
      </CardWithTitle>
    </>
  );
};

export default FeesView;
