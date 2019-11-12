import React from "react";
import { NetworkInfo } from "../../components/networkInfo/NetworkInfo";
import { NodeInfo } from "../../components/nodeInfo/NodeInfo";
import { WalletInfo } from "../../components/walletInfo/WalletInfo";

export const Home = () => {
  return (
    <>
      <NodeInfo />
      <NetworkInfo />
      <WalletInfo />
    </>
  );
};
