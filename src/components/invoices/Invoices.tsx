import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_INVOICES } from "../../graphql/query";
import { Card } from "../generic/Styled";

export const Invoices = () => {
  const { loading, error, data } = useQuery(GET_INVOICES);

  console.log(loading, error, data);

  if (loading || !data || !data.getInvoices) {
    return <Card bottom="10px">Loading....</Card>;
  }

  const renderInvoices = () => {
    return data.getInvoices.map((invoice: any, index: number) => {
      const {
        chainAddress,
        confirmedAt,
        createdAt,
        description,
        descriptionHash,
        expiresAt,
        id,
        isCanceled,
        isConfirmed,
        isHeld,
        isOutgoing,
        isPrivate,
        payments,
        received,
        receivedMtokens,
        request,
        secret,
        tokens
      } = invoice;
      return (
        <Card bottom="10px" key={index}>
          <p>{`Amount: ${tokens}`}</p>
          <p>{`Confirmed: ${isConfirmed}`}</p>
          <p>{`Received: ${received}`}</p>
          <p>{chainAddress}</p>
          <p>{confirmedAt}</p>
          <p>{createdAt}</p>
          <p>{description}</p>
          <p>{descriptionHash}</p>
          <p>{expiresAt}</p>
          <p>{id}</p>
          <p>{isCanceled}</p>
          <p>{isHeld}</p>
          <p>{isOutgoing}</p>
          <p>{isPrivate}</p>
          <p>{payments}</p>
          <p>{receivedMtokens}</p>
          <p>{request}</p>
          <p>{secret}</p>
        </Card>
      );
    });
  };

  return renderInvoices();
};
