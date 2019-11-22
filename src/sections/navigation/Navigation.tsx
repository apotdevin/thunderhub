import React from "react";
import styled from "styled-components";
import { Card } from "../../components/generic/Styled";
import { Link } from "react-router-dom";
import { NodeInfo } from "../../components/nodeInfo/NodeInfo";
import { SideSettings } from "../../components/sideSettings/SideSettings";

const NavigationStyle = styled.div`
  /* display: flex; */
  /* justify-content: center; */
  /* padding: 10px; */
  /* background-color: green; */
  grid-area: nav;
  margin-left: 0.5rem;
`;

const StickyCard = styled(Card)`
  position: -webkit-sticky;
  position: sticky;
  top: 10px;
`;

const LinkView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`;

export const Navigation = () => {
  return (
    <NavigationStyle>
      <StickyCard>
        <LinkView>
          <NodeInfo />
          <p>
            <Link to="/">Home</Link>
          </p>
          <p>
            <Link to="/channels">Channels</Link>
          </p>
          <p>
            <Link to="/pendingChannels">Pending Channels</Link>
          </p>
          <p>
            <Link to="/invoices">Invoices</Link>
          </p>
          <p>
            <Link to="/payments">Payments</Link>
          </p>
          <p>
            <Link to="/settings">Settings</Link>
          </p>
          <p>
            <Link to="/unknown">Unknown</Link>
          </p>
          <SideSettings />
        </LinkView>
      </StickyCard>
    </NavigationStyle>
  );
};
