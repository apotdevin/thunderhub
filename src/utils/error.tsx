import React, { ReactNode } from 'react';
import { ApolloError } from 'apollo-boost';

export const getErrorContent = (error: ApolloError): ReactNode => {
    const errors = error.graphQLErrors.map(x => x.message);

    const renderMessage = errors.map((error, i) => {
        if (error === 'rateLimitReached') {
            return 'Rate Limit Reached.';
        }
        try {
            const errorMsg = JSON.parse(error);
            return (
                <div
                    key={i}
                >{`${errorMsg.details} [${errorMsg.msg}/${errorMsg.code}]`}</div>
            );
        } catch (e) {
            console.log('JSON parsing error:', e);
        }
    });

    return <div>{renderMessage}</div>;
};
