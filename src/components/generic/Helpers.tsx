import React from "react";
import { SmallLink } from "./Styled";

export const getTransactionLink = (transaction: string) => {
  const link = `https://www.blockchain.com/btc/tx/${transaction}`;
  return (
    <SmallLink href={link} target="_blank">
      {transaction}
    </SmallLink>
  );
};

export const getNodeLink = (publicKey: string) => {
  const link = `https://1ml.com/node/${publicKey}`;
  return (
    <SmallLink href={link} target="_blank">
      {publicKey}
    </SmallLink>
  );
};
