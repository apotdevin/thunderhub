import React from "react";
import { StatusDot } from "./Channels.style";
import { DownArrow, UpArrow, EyeOff } from "../generic/Icons";

export const getStatusDot = (status: boolean, type: string) => {
  if (type === "active") {
    return status ? (
      <StatusDot color="#95de64" />
    ) : (
      <StatusDot color="#ff4d4f" />
    );
  } else if (type === "opening") {
    return status ? <StatusDot color="#13c2c2" /> : null;
  } else {
    return status ? <StatusDot color="#ff4d4f" /> : null;
  }
};

export const getSymbol = (status: boolean) => {
  return status ? <DownArrow /> : <UpArrow />;
};

export const getPrivate = (status: boolean) => {
  return status && <EyeOff />;
};
