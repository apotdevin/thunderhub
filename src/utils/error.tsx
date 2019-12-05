import React, { ReactNode } from 'react';
import { ApolloError } from 'apollo-boost';

export const getErrorContent = (error: ApolloError): ReactNode => {
    const errors = error.graphQLErrors.map(x => x.message);

    const renderMessage = errors.map((error, i) => {
        const errorMsg = JSON.parse(error);
        return (
            <div
                key={i}
            >{`${errorMsg.details} [${errorMsg.msg}/${errorMsg.code}]`}</div>
        );
    });

    return <div>{renderMessage}</div>;
};
