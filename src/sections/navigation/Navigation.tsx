import React from "react";
import styled from "styled-components";
import { Card } from "../../components/generic/Styled";
import { Link } from "react-router-dom";

const NavigationStyle = styled.div`
  display: flex;
  /* justify-content: center; */
  /* padding: 10px; */
  /* background-color: green; */
  grid-area: nav;
  margin-left: 0.5rem;
`;

export const Navigation = () => {
  return (
    <NavigationStyle>
      <Card>
        ThunderHub
        <p>
          <Link to="/">Home</Link>
        </p>
        <p>
          <Link to="/channels">Channels</Link>
        </p>
        <p>
          <Link to="/invoices">Invoices</Link>
        </p>
        <p>
          <Link to="/unknown">Unknown</Link>
        </p>
      </Card>
    </NavigationStyle>
  );
};
