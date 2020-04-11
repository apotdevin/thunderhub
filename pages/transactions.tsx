import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_RESUME } from '../src/graphql/query';
import {
  Card,
  CardWithTitle,
  SubTitle,
} from '../src/components/generic/Styled';
import { InvoiceCard } from '../src/views/transactions/InvoiceCard';
import { useAccount } from '../src/context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../src/utils/error';
import { PaymentsCard } from '../src/views/transactions/PaymentsCards';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';
import { FlowBox } from '../src/views/home/reports/flow';

const TransactionsView = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const [token, setToken] = useState('');
  const [fetching, setFetching] = useState(false);

  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const { loading, data, fetchMore } = useQuery(GET_RESUME, {
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

  const resumeList = JSON.parse(data.getResume.resume);

  return (
    <>
      <FlowBox />
      <CardWithTitle>
        <SubTitle>Transactions</SubTitle>
        <Card bottom={'8px'}>
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
            loading={fetching}
            disabled={fetching}
            onClick={() => {
              setFetching(true);
              fetchMore({
                variables: { auth, token },
                updateQuery: (prev, { fetchMoreResult: result }) => {
                  if (!result) return prev;
                  const newToken = result.getResume.token || '';
                  const prevEntries = JSON.parse(prev.getResume.resume);
                  const newEntries = JSON.parse(result.getResume.resume);

                  setFetching(false);
                  return {
                    getResume: {
                      token: newToken,
                      resume: JSON.stringify([...prevEntries, ...newEntries]),
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

export default TransactionsView;
