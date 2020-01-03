import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_RESUME } from '../../graphql/query';
import { Card, CardWithTitle, SubTitle, ColorButton } from '../generic/Styled';
import { InvoiceCard } from './InvoiceCard';
import { useAccount } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { PaymentsCard } from './PaymentsCards';
import styled from 'styled-components';
import { LoadingCard } from '../loading/LoadingCard';

export const AddMargin = styled.div`
    margin-left: 10px;
`;

export const ResumeList = () => {
    const [indexOpen, setIndexOpen] = useState(0);
    const [token, setToken] = useState('');

    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

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
        return <LoadingCard title={'Resume'} />;
    }

    const renderInvoices = () => {
        const resumeList = JSON.parse(data.getResume.resume);
        return (
            <CardWithTitle>
                <SubTitle>Resume</SubTitle>
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
                    color={'green'}
                    onClick={() =>
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
                        })
                    }
                >
                    Show More
                </ColorButton>
            </CardWithTitle>
        );
    };

    return renderInvoices();
};
