import React, { useContext, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_BITCOIN_PRICE } from "../../graphql/query";
import { SettingsContext } from "../../context/SettingsContext";

export const BitcoinPrice = () => {
  const { setSettings } = useContext(SettingsContext);
  const { loading, error, data } = useQuery(GET_BITCOIN_PRICE);

  useEffect(() => {
    if (!loading && data && data.getBitcoinPrice) {
      const { price, symbol } = data.getBitcoinPrice;
      setSettings({ price, symbol });
    }
  }, [data]);

  // console.log("Bitcoin Price", loading, error, data);

  return <></>;
};
