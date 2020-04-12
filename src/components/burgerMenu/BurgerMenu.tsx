import React from 'react';
import styled, { css } from 'styled-components';
import { burgerColor } from '../../styles/Themes';
import { NodeInfo } from '../../layouts/navigation/nodeInfo/NodeInfo';
import { SideSettings } from '../../layouts/navigation/sideSettings/SideSettings';
import { Navigation } from '../../layouts/navigation/Navigation';

const StyledBurger = styled.div`
  padding: 16px 16px 0;
  background-color: ${burgerColor};
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  ${({ open }: { open: boolean }) =>
    open &&
    css`
      margin-bottom: 16px;
    `}
`;

interface BurgerProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}

export const BurgerMenu = ({ open, setOpen }: BurgerProps) => {
  return (
    <StyledBurger open={open}>
      <NodeInfo isBurger={true} />
      <SideSettings isBurger={true} />
      <Navigation isBurger={true} setOpen={setOpen} />
    </StyledBurger>
  );
};
