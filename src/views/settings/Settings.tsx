import React, { useContext } from "react";
import { Card } from "../../components/generic/Styled";
import { SettingsContext } from "../../context/SettingsContext";

export const SettingsView = () => {
  const { theme, currency, setSettings } = useContext(SettingsContext);

  return (
    <Card>
      <div>
        Theme: {theme}
        <button onClick={() => setSettings({ theme: "light" })}>
          Light theme
        </button>
        <button onClick={() => setSettings({ theme: "dark" })}>
          Dark theme
        </button>
      </div>
      <div>
        Currency: {currency}
        <button onClick={() => setSettings({ currency: "btc" })}>BTC</button>
        <button onClick={() => setSettings({ currency: "sat" })}>SAT</button>
        <button onClick={() => setSettings({ currency: "eur" })}>EUR</button>
      </div>
    </Card>
  );
};
