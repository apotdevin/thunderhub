import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_PAYMENTS } from "../../graphql/query";
import { Card } from "../generic/Styled";
import { PaymentsCard } from "./PaymentsCards";

export const Payments = () => {
  const [indexOpen, setIndexOpen] = useState(0);
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
          return (
            <PaymentsCard
              payment={payment}
              index={index + 1}
              setIndexOpen={setIndexOpen}
              indexOpen={indexOpen}
            />
          );
        })}
      </Card>
    );
  };

  return renderInvoices();
};
