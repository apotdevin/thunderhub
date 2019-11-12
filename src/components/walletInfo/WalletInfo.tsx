import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_WALLET_INFO } from "../../graphql/query";
import { Card } from "../generic/Styled";

export const WalletInfo = () => {
  const { loading, error, data } = useQuery(GET_WALLET_INFO);

  console.log(loading, error, data);

  if (loading || !data) {
    return <Card bottom="10px">Loading....</Card>;
  }

  const chainBalance = data.getChainBalance;
  const pendingChainBalance = data.getPendingChainBalance;
  const { confirmedBalance, pendingBalance } = data.getChannelBalance;

  return (
    <Card bottom="10px">
      <p>{`Chain Balance: ${chainBalance}`}</p>
      <p>{`Pending Chain Balance: ${pendingChainBalance}`}</p>
      <p>{`Channel Balance: ${confirmedBalance}`}</p>
      <p>{`Pending Channel Balance: ${pendingBalance}`}</p>
    </Card>
  );
};
