import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ChevronRight, ChevronUp, ChevronDown } from 'react-feather';
import { useChannelFeesQuery } from 'src/graphql/queries/__generated__/getChannelFees.generated';
import { useUpdateFeesMutation } from 'src/graphql/mutations/__generated__/updateFees.generated';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { withApollo } from 'config/client';
import styled from 'styled-components';
import { useStatusState } from 'src/context/StatusContext';
import { ChannelFeeType } from 'src/graphql/types';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
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

const WithPointer = styled.div`
  cursor: pointer;
`;

const FeesView = () => {
  const { minorVersion, revision } = useStatusState();
  const canMax = (minorVersion === 7 && revision > 1) || minorVersion > 7;
  const canMin = (minorVersion === 8 && revision > 2) || minorVersion > 8;

  const [indexOpen, setIndexOpen] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  const [baseFee, setBaseFee] = useState(0);
  const [feeRate, setFeeRate] = useState(0);
  const [cltv, setCLTV] = useState(0);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);

  const { loading, data } = useChannelFeesQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const [updateFees] = useUpdateFeesMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      setBaseFee(0);
      setFeeRate(0);
      setCLTV(0);
      setMax(0);
      setMin(0);
      setIsEdit(false);
      data.updateFees
        ? toast.success('Channel Details Updated')
        : toast.error('Error updating fees');
    },
    refetchQueries: ['ChannelFees'],
  });

  if (loading || !data || !data.getChannelFees) {
    return <LoadingCard title={'Details'} />;
  }

  return (
    <>
      <Card>
        <WithPointer>
          <SingleLine onClick={() => setIsEdit(prev => !prev)}>
            <Sub4Title>Update All Channel Details</Sub4Title>
            {isEdit ? <ChevronUp /> : <ChevronDown />}
          </SingleLine>
        </WithPointer>
        {isEdit && (
          <>
            <Separation />
            <InputWithDeco
              title={'BaseFee'}
              value={baseFee}
              placeholder={'sats'}
              amount={baseFee}
              override={'sat'}
              inputType={'number'}
              inputCallback={value => setBaseFee(Number(value))}
            />
            <InputWithDeco
              title={'Fee Rate'}
              value={feeRate}
              placeholder={'ppm'}
              amount={feeRate}
              override={'ppm'}
              inputType={'number'}
              inputCallback={value => setFeeRate(Number(value))}
            />
            <InputWithDeco
              title={'CLTV Delta'}
              value={cltv}
              placeholder={'cltv delta'}
              customAmount={cltv ? cltv.toString() : ''}
              inputType={'number'}
              inputCallback={value => setCLTV(Number(value))}
            />
            {canMax && (
              <InputWithDeco
                title={'Max HTLC'}
                value={max}
                placeholder={'sats'}
                amount={max}
                override={'sat'}
                inputType={'number'}
                inputCallback={value => setMax(Number(value))}
              />
            )}
            {canMin && (
              <InputWithDeco
                title={'Min HTLC'}
                value={min}
                placeholder={'sats'}
                amount={min}
                override={'sat'}
                inputType={'number'}
                inputCallback={value => setMin(Number(value))}
              />
            )}
            <RightAlign>
              <ColorButton
                onClick={() =>
                  updateFees({
                    variables: {
                      ...(baseFee !== 0 && { base_fee_tokens: baseFee }),
                      ...(feeRate !== 0 && { fee_rate: feeRate }),
                      ...(cltv !== 0 && { cltv_delta: cltv }),
                      ...(max !== 0 &&
                        canMax && {
                          max_htlc_mtokens: (max * 1000).toString(),
                        }),
                      ...(min !== 0 &&
                        canMin && {
                          min_htlc_mtokens: (min * 1000).toString(),
                        }),
                    },
                  })
                }
                disabled={
                  baseFee === 0 &&
                  feeRate === 0 &&
                  cltv === 0 &&
                  max === 0 &&
                  min === 0
                }
                fullWidth={true}
                withMargin={'16px 0 0'}
              >
                Update Fees
                <ChevronRight size={18} />
              </ColorButton>
            </RightAlign>
          </>
        )}
      </Card>

      <CardWithTitle>
        <SubTitle>Channel Details</SubTitle>
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          {data.getChannelFees.map((channel, index) => (
            <FeeCard
              channel={channel as ChannelFeeType}
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
