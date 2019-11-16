import React, { useContext } from "react";
import { Card } from "../../components/generic/Styled";
import { SettingsContext } from "../../context/SettingsContext";

export const SettingsView = () => {
  const { theme, currency, setSettings } = useContext(SettingsContext);

  return (
    <Card>
      <div>
        Theme: {theme}
        <button
          onClick={() => {
            localStorage.setItem("theme", "light");
            setSettings({ theme: "light" });
          }}
        >
          Light theme
        </button>
        <button
          onClick={() => {
            localStorage.setItem("theme", "dark");
            setSettings({ theme: "dark" });
          }}
        >
          Dark theme
        </button>
      </div>
      <div>
        Currency: {currency}
        <button
          onClick={() => {
            localStorage.setItem("currency", "btc");
            setSettings({ currency: "btc" });
          }}
        >
          BTC
        </button>
        <button
          onClick={() => {
            localStorage.setItem("currency", "sat");
            setSettings({ currency: "sat" });
          }}
        >
          SAT
        </button>
        <button
          onClick={() => {
            localStorage.setItem("currency", "EUR");
            setSettings({ currency: "EUR" });
          }}
        >
          EUR
        </button>
      </div>
    </Card>
  );
};
