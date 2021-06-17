import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { InvoiceCard } from 'src/views/transactions/InvoiceCard';
import {
  GetResumeQuery,
  useGetResumeQuery,
} from 'src/graphql/queries/__generated__/getResume.generated';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';

import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { RefreshCw, Settings } from 'react-feather';
import styled, { css } from 'styled-components';
import {
  Card,
  CardWithTitle,
  SubTitle,
  SingleLine,
  DarkSubTitle,
} from '../src/components/generic/Styled';
import { getErrorContent } from '../src/utils/error';
import { PaymentsCard } from '../src/views/transactions/PaymentsCards';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';
import { FlowBox } from '../src/views/home/reports/flow';
import { useLocalStorage } from 'src/hooks/UseLocalStorage';
import { useNodeInfo } from 'src/hooks/UseNodeInfo';
import {
  defaultSettings,
  TransactionSettings,
} from 'src/views/transactions/Settings';
import { subDays, format } from 'date-fns';

type RotationProps = {
  withRotation: boolean;
};

type ResumeTransactions = GetResumeQuery['getResume']['resume'];

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

  const [open, setOpen] = useState<boolean>(false);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(7);

  const { publicKey } = useNodeInfo();

  const [settings] = useLocalStorage('transactionSettings', defaultSettings);

  const { data, startPolling, stopPolling, networkStatus } = useGetResumeQuery({
    ssr: false,
    variables: { offset: 0, limit },
    notifyOnNetworkStatusChange: true,
    onError: error => toast.error(getErrorContent(error)),
  });

  const isLoading = networkStatus === 1;
  const isRefetching = networkStatus === 3;

  const loadingOrRefetching = isLoading || isRefetching;

  useEffect(() => {
    if (isLoading || !data?.getResume?.offset) return;
    setOffset(data.getResume.offset);
  }, [data, isLoading]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  if (isLoading || !data || !data.getResume) {
    return (
      <>
        <FlowBox />
        <LoadingCard title={'Transactions'} />
      </>
    );
  }

  const beforeDate = subDays(new Date(), offset);

  const selfInvoices: string[] = data.getResume.resume.reduce((p, c) => {
    if (!c) return p;
    if (c.__typename === 'PaymentType') {
      if (c.destination === publicKey) {
        return [...p, c.id];
      }
    }
    return p;
  }, [] as string[]);

  const resumeList = data.getResume.resume?.reduce((p, c) => {
    const { rebalance, confirmed } = settings;

    if (!c) return p;

    if (rebalance) {
      if (c.__typename === 'PaymentType') {
        if (c.destination === publicKey) {
          return p;
        }
      }
      if (selfInvoices.includes(c.id)) {
        return p;
      }
    }

    if (confirmed) {
      if (!c.is_confirmed) {
        return p;
      }
    }

    return [...p, c];
  }, [] as ResumeTransactions);

  const handleClick = (limit: number) => setLimit(offset + limit);

  return (
    <>
      <FlowBox />
      <CardWithTitle>
        <SingleLine>
          <SubTitle>
            Transactions
            <DarkSubTitle fontSize={'12px'}>
              {`${format(beforeDate, 'dd/MM/yy')} - Today`}
            </DarkSubTitle>
          </SubTitle>
          <SingleLine>
            <ColorButton
              withMargin={'0 0 8px 8px'}
              onClick={() => {
                setOpen(p => !p);
              }}
            >
              <Settings size={18} />
            </ColorButton>
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
        </SingleLine>
        {open && (
          <Card>
            <TransactionSettings />
          </Card>
        )}
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
