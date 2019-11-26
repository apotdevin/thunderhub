import React from "react";
import { ChartRow, ChartLink } from "../generic/Styled";

export const ButtonRow = ({ isTime, setIsTime, isType, setIsType }: any) => {
  return (
    <ChartRow style={{ marginTop: "16px" }}>
      <ChartRow>
        <ChartLink selected={isTime === "day"} onClick={() => setIsTime("day")}>
          Day
        </ChartLink>
        <ChartLink
          selected={isTime === "week"}
          onClick={() => setIsTime("week")}
        >
          Week
        </ChartLink>
        <ChartLink
          selected={isTime === "month"}
          onClick={() => setIsTime("month")}
        >
          Month
        </ChartLink>
      </ChartRow>
      <ChartRow>
        <ChartLink
          selected={isType === "amount"}
          onClick={() => setIsType("amount")}
        >
          Amount
        </ChartLink>
        <ChartLink selected={isType === "fee"} onClick={() => setIsType("fee")}>
          Fees
        </ChartLink>
        <ChartLink
          selected={isType === "tokens"}
          onClick={() => setIsType("tokens")}
        >
          Value
        </ChartLink>
      </ChartRow>
    </ChartRow>
  );
};
