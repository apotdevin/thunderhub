import React, { ReactNode } from 'react';

export const getErrorContent = (error: any): ReactNode => {
  const errors = error.graphQLErrors.map(x => x.message);

  const renderMessage = errors.map((error, i) => {
    try {
      const errorMsg = JSON.parse(error);
      return (
        <div
          key={i}
        >{`${errorMsg.details} [${errorMsg.msg}/${errorMsg.code}]`}</div>
      );
    } catch (e) {
      return error;
    }
  });

  return <div>{renderMessage}</div>;
};
