import React, { useState } from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  DarkSubTitle,
  ResponsiveLine,
} from '../src/components/generic/Styled';
import { useQuery } from '@apollo/react-hooks';
import { GET_HODL_OFFERS } from '../src/graphql/hodlhodl/query';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { OfferCard } from '../src/views/trading/OfferCard';
import { OfferFilters } from '../src/views/trading/OfferFilters';
import { toast } from 'react-toastify';
import { Link } from '../src/components/link/Link';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';
import { useRouter } from 'next/router';

export interface QueryProps {
  pagination: {
    limit: number;
    offset: number;
  };
  filters: {};
  sort: {
    by: string;
    direction: string;
  };
}

const defaultQuery: QueryProps = {
  pagination: {
    limit: 25,
    offset: 0,
  },
  filters: {},
  sort: {
    by: '',
    direction: '',
  },
};

const TradingView = () => {
  const { query } = useRouter();

  let decoded: QueryProps = defaultQuery;
  if (query?.filter) {
    try {
      decoded = JSON.parse(atob(query.filter[0]));
    } catch (error) {
      toast.error('Incorrect url.');
    }
  }

  const queryObject = {
    ...defaultQuery,
    ...decoded,
  };

  const [indexOpen, setIndexOpen] = useState(0);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);

  const { data, loading, fetchMore, error } = useQuery(GET_HODL_OFFERS, {
    variables: { filter: JSON.stringify(queryObject) },
    onError: () => toast.error('Error getting offers. Please try again.'),
  });

  if (error) {
    return (
      <CardWithTitle>
        <SubTitle>P2P Trading</SubTitle>
        <Card bottom={'16px'}>Failed to connect with HodlHodl.</Card>
      </CardWithTitle>
    );
  }

  if (loading || !data || !data.getOffers) {
    return <LoadingCard title={'P2P Trading'} />;
  }

  const amountOfOffers = data.getOffers.length;
  const {
    pagination: { limit },
  } = queryObject;

  return (
    <CardWithTitle>
      <ResponsiveLine>
        <SubTitle>P2P Trading</SubTitle>
        <DarkSubTitle>
          Powered by <Link href={'https://hodlhodl.com/'}>HodlHodl</Link>
        </DarkSubTitle>
      </ResponsiveLine>
      <Card bottom={'16px'}>
        <OfferFilters offerFilters={queryObject} />
      </Card>
      <Card bottom={'8px'}>
        {amountOfOffers <= 0 && <DarkSubTitle>No Offers Found</DarkSubTitle>}
        {data.getOffers.map((offer: any, index: number) => (
          <OfferCard
            offer={offer}
            index={index + 1}
            setIndexOpen={setIndexOpen}
            indexOpen={indexOpen}
            key={`${index}-${offer.id}`}
          />
        ))}
      </Card>
      {amountOfOffers > 0 && amountOfOffers === limit * page && (
        <ColorButton
          loading={fetching}
          disabled={fetching}
          onClick={() => {
            setFetching(true);

            fetchMore({
              variables: {
                filter: JSON.stringify({
                  ...queryObject,
                  pagination: { limit, offset: limit * page },
                }),
              },
              updateQuery: (prev, { fetchMoreResult: result }) => {
                if (!result) return prev;

                setFetching(false);
                setPage(prev => prev + 1);
                return {
                  getOffers: [...prev.getOffers, ...result.getOffers],
                };
              },
            });
          }}
        >
          Show More
        </ColorButton>
      )}
    </CardWithTitle>
  );
};

export default TradingView;
