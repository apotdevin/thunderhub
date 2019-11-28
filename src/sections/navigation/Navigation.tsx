import React from "react";
import styled from "styled-components";
import { Card } from "../../components/generic/Styled";
import { Link, useLocation } from "react-router-dom";
import { NodeInfo } from "../../components/nodeInfo/NodeInfo";
import { SideSettings } from "../../components/sideSettings/SideSettings";
import { textColor, unSelectedNavButton } from "../../styles/Themes";
import {
  Home,
  Cpu,
  Server,
  Send,
  Settings
} from "../../components/generic/Icons";

const NavigationStyle = styled.div`
  grid-area: nav;
  margin-left: 0.5rem;
`;

const StickyCard = styled.div`
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

const ButtonSection = styled.div`
  width: 100%;
`;

const NavSeparation = styled.div`
  width: 10px;
`;

const NavButton = styled(Link)`
  padding: 10px;
  background: ${({ selected }: { selected: boolean }) =>
    selected
      ? `linear-gradient(
		90deg,
		rgba(255, 255, 255, 0.1) 0%,
		rgba(255, 255, 255, 0) 90%
	)`
      : ""};
  display: flex;
  align-items: center;
  width: 100%;
  text-decoration: none;
  margin: 15px 0;
  color: ${({ selected }: { selected: boolean }) =>
    selected ? textColor : unSelectedNavButton};
`;

const HOME_LINK = "/";
const CHANNEL_LINK = "/channels";
const INVOICE_LINK = "/invoices";
const PAYMENT_LINK = "/payments";
const SETTINGS_LINK = "/settings";

export const Navigation = () => {
  const { pathname } = useLocation();

  return (
    <NavigationStyle>
      <StickyCard>
        <LinkView>
          <NodeInfo />
          <ButtonSection>
            <NavButton selected={pathname === HOME_LINK} to={HOME_LINK}>
              <Home />
              <NavSeparation />
              Home
            </NavButton>
            <NavButton selected={pathname === CHANNEL_LINK} to={CHANNEL_LINK}>
              <Cpu />
              <NavSeparation />
              Channels
            </NavButton>
            <NavButton selected={pathname === INVOICE_LINK} to={INVOICE_LINK}>
              <Server />
              <NavSeparation />
              Invoices
            </NavButton>
            <NavButton selected={pathname === PAYMENT_LINK} to={PAYMENT_LINK}>
              <Send />
              <NavSeparation />
              Payments
            </NavButton>
            <NavButton selected={pathname === SETTINGS_LINK} to={SETTINGS_LINK}>
              <Settings />
              <NavSeparation />
              Settings
            </NavButton>
          </ButtonSection>
          <SideSettings />
        </LinkView>
      </StickyCard>
    </NavigationStyle>
  );
};
