import React, { useState } from "react";
import { CardWithTitle, SubTitle, Card, Sub4Title } from "../generic/Styled";
import { useMutation } from "@apollo/react-hooks";
import { PAY_INVOICE } from "../../graphql/mutation";
import { Send, Settings } from "../generic/Icons";
import styled from "styled-components";
import {
  textColor,
  buttonBorderColor,
  unSelectedNavButton
} from "../../styles/Themes";

const SingleLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SimpleButton = styled.button`
  padding: 5px;
  margin: 5px;
  text-decoration: none;
  background-color: transparent;
  color: ${({ enabled = true }: { enabled?: boolean }) =>
    enabled ? textColor : unSelectedNavButton};
  border: 1px solid ${buttonBorderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  /* width: 150px; */
  /* width: 20% */
  white-space: nowrap;
`;

const Input = styled.input`
  width: 100%;
  margin: 10px 20px;
  border: 0;
  border-bottom: 2px solid #c8ccd4;
  background: none;
  border-radius: 0;
  color: ${textColor};
  transition: all 0.5s ease;

  &:hover {
    border-bottom: 2px solid #0077ff;
  }

  &:focus {
    outline: none;
    background: none;
    border-bottom: 2px solid #0077ff;
  }
`;

export const PayCard = () => {
  const [request, setRequest] = useState("");
  const [makePayment, { data, loading, error }] = useMutation(PAY_INVOICE);

  console.log(data, loading, error);

  return (
    <CardWithTitle>
      <SubTitle>Send Sats</SubTitle>
      <Card bottom={"10px"}>
        <SingleLine>
          <Sub4Title>Request:</Sub4Title>
          <Input onChange={e => setRequest(e.target.value)} />
          <SimpleButton>
            <Settings />
          </SimpleButton>
          <SimpleButton
            enabled={request !== ""}
            onClick={() => {
              makePayment({ variables: { request } });
            }}
          >
            <Send />
            Send Sats
          </SimpleButton>
        </SingleLine>
      </Card>
    </CardWithTitle>
  );
};
