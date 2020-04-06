import React, { useState } from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
    DarkSubTitle,
    ResponsiveLine,
} from 'components/generic/Styled';
import { useQuery } from '@apollo/react-hooks';
import { GET_HODL_OFFERS } from 'graphql/hodlhodl/query';
import { LoadingCard } from 'components/loading/LoadingCard';
import { OfferCard } from './OfferCard';
import { OfferFilters } from './OfferFilters';
import { useLocation } from 'react-router-dom';
import qs from 'qs';
import { toast } from 'react-toastify';

export interface QueryProps {
    filters: {};
    sort: {
        by: string;
        direction: string;
    };
}

const defaultQuery: QueryProps = {
    filters: {},
    sort: {
        by: '',
        direction: '',
    },
};

export const TraderView = () => {
    const { search } = useLocation();

    const query = qs.parse(search, { ignoreQueryPrefix: true });

    let decoded: QueryProps = defaultQuery;
    if (!!query.filter) {
        try {
            decoded = JSON.parse(atob(query.filter));
        } catch (error) {
            toast.error('Incorrect url.');
        }
    }

    const queryObject = {
        ...defaultQuery,
        ...decoded,
    };

    const [indexOpen, setIndexOpen] = useState(0);

    const { data, loading, error } = useQuery(GET_HODL_OFFERS, {
        variables: { filter: JSON.stringify(queryObject) },
    });

    if (loading || !data || !data.getOffers) {
        return <LoadingCard title={'Trade Bitcoin'} />;
    }

    return (
        <CardWithTitle>
            <ResponsiveLine>
                <SubTitle>Trade Bitcoin</SubTitle>
                <DarkSubTitle bottom={'8px'}>Powered by HodlHodl</DarkSubTitle>
            </ResponsiveLine>
            <Card bottom={'16px'}>
                <OfferFilters offerFilters={queryObject} />
            </Card>
            <Card>
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
        </CardWithTitle>
    );
};
