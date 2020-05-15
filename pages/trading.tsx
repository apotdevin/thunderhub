import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import {
  CardWithTitle,
  SubTitle,
  Card,
  DarkSubTitle,
  ResponsiveLine,
} from '../src/components/generic/Styled';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { OfferCard } from '../src/views/trading/OfferCard';
import { OfferFilters } from '../src/views/trading/OfferFilters';
import { Link } from '../src/components/link/Link';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';
import { decode } from '../src/utils/helpers';
import { useGetOffersQuery } from '../src/generated/graphql';

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
    const { filter } = query;
    try {
      if (typeof filter === 'string') {
        decoded = JSON.parse(decode(filter));
      } else {
        decoded = JSON.parse(decode(filter[0]));
      }
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

  const { data, loading, fetchMore, error } = useGetOffersQuery({
    variables: { filter: JSON.stringify(queryObject) },
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
