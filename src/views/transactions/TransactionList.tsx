import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_RESUME } from '../../graphql/query';
import {
    Card,
    CardWithTitle,
    SubTitle,
    ColorButton,
} from '../../components/generic/Styled';
import { InvoiceCard } from './InvoiceCard';
import { useAccount } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { PaymentsCard } from './PaymentsCards';
import { LoadingCard } from '../../components/loading/LoadingCard';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { useSettings } from '../../context/SettingsContext';
import { textColorMap } from '../../styles/Themes';

export const TransactionList = () => {
    const [indexOpen, setIndexOpen] = useState(0);
    const [token, setToken] = useState('');
    const [fetching, setFetching] = useState(false);

    const { theme } = useSettings();
    const { host, read, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(host, read !== '' ? read : sessionAdmin, cert);

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

    const renderInvoices = () => {
        const resumeList = JSON.parse(data.getResume.resume);
        return (
            <CardWithTitle>
                <SubTitle>Transactions</SubTitle>
                <Card bottom={'5px'}>
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
                        } else {
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
                    })}
                </Card>
                <ColorButton
                    color={textColorMap[theme]}
                    disabled={fetching}
                    onClick={() => {
                        setFetching(true);
                        fetchMore({
                            variables: { auth, token },
                            updateQuery: (
                                prev,
                                { fetchMoreResult: result },
                            ) => {
                                if (!result) return prev;
                                const newToken = result.getResume.token || '';
                                const prevEntries = JSON.parse(
                                    prev.getResume.resume,
                                );
                                const newEntries = JSON.parse(
                                    result.getResume.resume,
                                );

                                setFetching(false);
                                return {
                                    getResume: {
                                        token: newToken,
                                        resume: JSON.stringify([
                                            ...prevEntries,
                                            ...newEntries,
                                        ]),
                                        __typename: 'getResumeType',
                                    },
                                };
                            },
                        });
                    }}
                >
                    {fetching ? (
                        <ScaleLoader
                            height={10}
                            width={2}
                            color={textColorMap[theme]}
                        />
                    ) : (
                        'Show More'
                    )}
                </ColorButton>
            </CardWithTitle>
        );
    };

    return renderInvoices();
};
