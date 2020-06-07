import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ChevronRight, ChevronUp, ChevronDown } from 'react-feather';
import { useAccountState } from 'src/context/AccountContext';
import { useChannelFeesQuery } from 'src/graphql/queries/__generated__/getChannelFees.generated';
import { useUpdateFeesMutation } from 'src/graphql/mutations/__generated__/updateFees.generated';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { withApollo } from 'config/client';
import styled from 'styled-components';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
  Sub4Title,
  Separation,
  RightAlign,
} from '../src/components/generic/Styled';
import { getErrorContent } from '../src/utils/error';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { FeeCard } from '../src/views/fees/FeeCard';
import { SecureButton } from '../src/components/buttons/secureButton/SecureButton';
import { AdminSwitch } from '../src/components/adminSwitch/AdminSwitch';

const WithPointer = styled.div`
  cursor: pointer;
`;

const FeesView = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [baseFee, setBaseFee] = useState(0);
  const [feeRate, setFeeRate] = useState(0);

  const { auth } = useAccountState();

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
    refetchQueries: ['ChannelFees'],
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
            <WithPointer>
              <SingleLine onClick={() => setIsEdit(prev => !prev)}>
                <Sub4Title>Channel Fees</Sub4Title>
                {isEdit ? <ChevronUp /> : <ChevronDown />}
              </SingleLine>
            </WithPointer>
            {isEdit && (
              <>
                <Separation />
                <InputWithDeco
                  title={'BaseFee'}
                  placeholder={'sats'}
                  amount={baseFee}
                  override={'sat'}
                  inputType={'number'}
                  inputCallback={value => setBaseFee(Number(value))}
                />
                <InputWithDeco
                  title={'Fee Rate'}
                  placeholder={'sats/million sats'}
                  amount={feeRate}
                  override={'ppm'}
                  inputType={'number'}
                  inputCallback={value => setFeeRate(Number(value))}
                />
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
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          {data.getChannelFees.map((channel, index: number) => (
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

const Wrapped = () => (
  <GridWrapper>
    <FeesView />
  </GridWrapper>
);

export default withApollo(Wrapped);
