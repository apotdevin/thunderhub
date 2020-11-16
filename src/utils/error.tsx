import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ApolloError } from '@apollo/client';

const getMessage = (error: string) => {
  switch (error) {
    case 'PaymentRejectedByDestination':
      return 'This node does not accept keysend payments.';
    case 'FailedToFindPayableRouteToDestination':
    case 'NoRouteFound':
      return 'Did not find a possible route.';
    case 'SendPaymentFail':
      return 'Failed to send this payments.';
    case 'AccountNotAuthenticated':
      return 'This account is not authenticated.';
    case 'AccountTypeDoesNotExist':
      return 'This account does not exist.';
    case 'WrongPasswordForLogin':
      return 'Wrong password provided.';
    case 'InsufficientBalanceToAttemptPayment':
      return 'Insufficient balance for payment.';
    case 'CannotPayThroughMultipleOutPeersOnSinglePath':
      return 'Error paying invoice. Try using more paths.';
    default:
      return error;
  }
};

const ErrorBox = styled.div``;

const ErrorLine = styled.div`
  padding: 4px 0;

  -ms-word-break: break-all;
  word-break: break-all;
  word-break: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
`;

export const getErrorContent = (error: ApolloError): ReactNode => {
  const errors = error.graphQLErrors.map(x => x.message);

  const renderMessage = errors.map((errorMsg, i) => {
    return <ErrorLine key={i}>{getMessage(errorMsg)}</ErrorLine>;
  });

  return <ErrorBox>{renderMessage}</ErrorBox>;
};

export const getErrorText = (error: ApolloError): ReactNode => {
  const errors = error.graphQLErrors.map(x => x.message);

  return getMessage(errors[0]);
};
