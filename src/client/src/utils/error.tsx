import { ReactNode } from 'react';
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

export const getErrorContent = (error: ApolloError): JSX.Element => {
  const errors = error.graphQLErrors.map(x => x.message);

  if (!errors.length) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <div>
      {errors.map((errorMsg, i) => {
        return (
          <div key={i} className="py-1 wrap-break-word">
            {getMessage(errorMsg)}
          </div>
        );
      })}
    </div>
  );
};

export const getErrorText = (error: ApolloError): ReactNode => {
  const errors = error.graphQLErrors.map(x => x.message);

  return getMessage(errors[0]);
};
