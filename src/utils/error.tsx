import React, { ReactNode } from 'react';

export const getErrorContent = (errors: string[]): ReactNode => {
    const renderMessage = errors.map((error, i) => {
        const errorMsg = JSON.parse(error);
        return <div key={i}>{`${errorMsg.msg} [${errorMsg.code}]`}</div>;
    });

    console.log(errors);
    return <div>{renderMessage}</div>;
};
