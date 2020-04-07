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
import { Link } from 'components/link/Link';
import { ColorButton } from 'components/buttons/colorButton/ColorButton';

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
    const [page, setPage] = useState(1);
    const [fetching, setFetching] = useState(false);

    const { data, loading, fetchMore, error } = useQuery(GET_HODL_OFFERS, {
        variables: { filter: JSON.stringify(queryObject) },
    });

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
                    Powered by{' '}
                    <Link href={'https://hodlhodl.com/'}>HodlHodl</Link>
                </DarkSubTitle>
            </ResponsiveLine>
            <Card bottom={'16px'}>
                <OfferFilters offerFilters={queryObject} />
            </Card>
            <Card bottom={'8px'}>
                {amountOfOffers <= 0 && (
                    <DarkSubTitle>No Offers Found</DarkSubTitle>
                )}
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
                            updateQuery: (
                                prev,
                                { fetchMoreResult: result },
                            ) => {
                                if (!result) return prev;

                                setFetching(false);
                                setPage((prev) => (prev += 1));
                                return {
                                    getOffers: [
                                        ...prev.getOffers,
                                        ...result.getOffers,
                                    ],
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
