import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_PAYMENTS } from "../../graphql/query";
import { Card } from "../generic/Styled";
import { PaymentsCard } from "./PaymentsCards";

export const Payments = () => {
  const { loading, error, data } = useQuery(GET_PAYMENTS);

  console.log(loading, error, data);

  if (loading || !data || !data.getPayments) {
    return <Card bottom="10px">Loading....</Card>;
  }

  const renderInvoices = () => {
    return (
      <Card>
        <h1 style={{ margin: "0", marginBottom: "10px" }}>Payments</h1>
        {data.getPayments.map((payment: any, index: number) => {
          return <PaymentsCard key={index} payment={payment} />;
        })}
      </Card>
    );
  };

  return renderInvoices();
};
