import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAccountState } from 'src/context/AccountContext';
import { InvoiceCard } from 'src/views/transactions/InvoiceCard';
import {
  useGetResumeQuery,
  GetResumeQuery,
} from 'src/graphql/queries/__generated__/getResume.generated';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { withApollo } from 'config/client';
import {
  Card,
  CardWithTitle,
  SubTitle,
} from '../src/components/generic/Styled';
import { getErrorContent } from '../src/utils/error';
import { PaymentsCard } from '../src/views/transactions/PaymentsCards';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';
import { FlowBox } from '../src/views/home/reports/flow';

const TransactionsView = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const [token, setToken] = useState('');

  const { auth } = useAccountState();

  const { loading, data, fetchMore } = useGetResumeQuery({
    skip: !auth,
    variables: { auth, token: '' },
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.getResume && data.getResume.token) {
      setToken(data.getResume.token);
    }
  }, [data, loading]);

  if (loading || !data || !data.getResume) {
    return <LoadingCard title={'Transactions'} />;
  }

  const resumeList = data.getResume.resume;

  return (
    <>
      <FlowBox />
      <CardWithTitle>
        <SubTitle>Transactions</SubTitle>
        <Card bottom={'8px'} mobileCardPadding={'0'} mobileNoBackground={true}>
          {resumeList.map((entry: any, index: number) => {
            if (entry.type === 'invoice') {
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
            return (
              <PaymentsCard
                payment={entry}
                key={index}
                index={index + 1}
                setIndexOpen={setIndexOpen}
                indexOpen={indexOpen}
              />
            );
          })}
          <ColorButton
            fullWidth={true}
            withMargin={'16px 0 0'}
            onClick={() => {
              fetchMore({
                variables: { auth, token },
                updateQuery: (
                  prev,
                  {
                    fetchMoreResult: result,
                  }: { fetchMoreResult: GetResumeQuery }
                ) => {
                  if (!result) return prev;
                  const newToken = result.getResume.token || '';
                  const prevEntries = prev.getResume.resume;
                  const newEntries = result.getResume.resume;

                  const allTransactions = newToken
                    ? [...prevEntries, ...newEntries]
                    : prevEntries;

                  return {
                    getResume: {
                      token: newToken,
                      resume: allTransactions,
                      __typename: 'getResumeType',
                    },
                  };
                },
              });
            }}
          >
            Show More
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

export default withApollo(Wrapped);
