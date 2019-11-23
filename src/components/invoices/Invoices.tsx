import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_INVOICES } from "../../graphql/query";
import { Card } from "../generic/Styled";
import { InvoiceCard } from "./InvoiceCard";

export const Invoices = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const { loading, error, data } = useQuery(GET_INVOICES);

  console.log(loading, error, data);

  if (loading || !data || !data.getInvoices) {
    return <Card bottom="10px">Loading....</Card>;
  }

  const renderInvoices = () => {
    return (
      <Card>
        <h1 style={{ margin: "0", marginBottom: "10px" }}>Invoices</h1>
        {data.getInvoices.map((invoice: any, index: number) => {
          return (
            <InvoiceCard
              invoice={invoice}
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
