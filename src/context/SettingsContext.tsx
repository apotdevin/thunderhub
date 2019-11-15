import React, { createContext, useState } from "react";
import merge from "lodash.merge";

interface ChangeProps {
  currency?: string;
  theme?: string;
}

interface SettingsProps {
  currency: string;
  theme: string;
  setSettings: (newProps: ChangeProps) => void;
}

export const SettingsContext = createContext<SettingsProps>({
  currency: "",
  theme: "",
  setSettings: () => {}
});

const SettingsProvider = ({ children }: any) => {
  const setSettings = ({ currency, theme }: ChangeProps) => {
    updateSettings((prevState: any) => {
      const newState = { ...prevState };
      return merge(newState, {
        currency,
        theme
      });
    });
  };

  const settingsState = {
    currency: "sat",
    theme: "light",
    setSettings
  };

  const [settings, updateSettings] = useState(settingsState);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
