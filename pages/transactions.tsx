import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { InvoiceCard } from 'src/views/transactions/InvoiceCard';
import { useGetResumeQuery } from 'src/graphql/queries/__generated__/getResume.generated';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';

import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { RefreshCw } from 'react-feather';
import styled, { css } from 'styled-components';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
} from '../src/components/generic/Styled';
import { getErrorContent } from '../src/utils/error';
import { PaymentsCard } from '../src/views/transactions/PaymentsCards';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';
import { FlowBox } from '../src/views/home/reports/flow';

type RotationProps = {
  withRotation: boolean;
};

const Rotation = styled.div<RotationProps>`
  ${({ withRotation }) =>
    withRotation &&
    css`
      animation: rotation 2s infinite linear;
    `}

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const TransactionsView = () => {
  const [isPolling, setIsPolling] = useState(false);
  const [indexOpen, setIndexOpen] = useState(0);

  const [offset, setOffset] = useState(0);

  const {
    data,
    fetchMore,
    startPolling,
    stopPolling,
    networkStatus,
  } = useGetResumeQuery({
    ssr: false,
    variables: { offset: 0 },
    notifyOnNetworkStatusChange: true,
    onError: error => toast.error(getErrorContent(error)),
  });

  const isLoading = networkStatus === 1;
  const isRefetching = networkStatus === 3;

  const loadingOrRefetching = isLoading || isRefetching;

  useEffect(() => {
    if (!isLoading && data?.getResume?.offset) {
      setOffset(data.getResume.offset);
    }
  }, [data, isLoading]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  if (isLoading || !data || !data.getResume) {
    return <LoadingCard title={'Transactions'} />;
  }

  const resumeList = data.getResume.resume;

  const handleClick = (limit: number) =>
    fetchMore({ variables: { offset, limit } });

  return (
    <>
      <FlowBox />
      <CardWithTitle>
        <SingleLine>
          <SubTitle>Transactions</SubTitle>
          <ColorButton
            withMargin={'0 0 8px'}
            onClick={() => {
              if (isPolling) {
                setIsPolling(false);
                stopPolling();
              } else {
                setIsPolling(true);
                startPolling(1000);
              }
            }}
          >
            <Rotation withRotation={isPolling}>
              <RefreshCw size={18} />
            </Rotation>
          </ColorButton>
        </SingleLine>
        <Card bottom={'8px'} mobileCardPadding={'0'} mobileNoBackground={true}>
          {resumeList?.map((entry, index: number) => {
            if (!entry) {
              return null;
            }
            if (entry.__typename === 'InvoiceType') {
              return (
                <InvoiceCard
                  invoice={entry}
                  key={index}
                  index={index + 1}
                  setIndexOpen={setIndexOpen}
                  indexOpen={indexOpen}
                />
              );
            }
            if (entry.__typename === 'PaymentType') {
              return (
                <PaymentsCard
                  payment={entry}
                  key={index}
                  index={index + 1}
                  setIndexOpen={setIndexOpen}
                  indexOpen={indexOpen}
                />
              );
            }
            return null;
          })}
          <ColorButton
            loading={loadingOrRefetching}
            disabled={loadingOrRefetching}
            fullWidth={true}
            withMargin={'16px 0 0'}
            onClick={() => handleClick(1)}
          >
            Get 1 More Day
          </ColorButton>
          <ColorButton
            loading={loadingOrRefetching}
            disabled={loadingOrRefetching}
            fullWidth={true}
            withMargin={'16px 0 0'}
            onClick={() => handleClick(7)}
          >
            Get 1 More Week
          </ColorButton>
          <ColorButton
            loading={loadingOrRefetching}
            disabled={loadingOrRefetching}
            fullWidth={true}
            withMargin={'16px 0 0'}
            onClick={() => handleClick(30)}
          >
            Get 1 More Month
          </ColorButton>
        </Card>
      </CardWithTitle>
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <TransactionsView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
