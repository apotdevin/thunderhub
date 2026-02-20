import styled, { css } from 'styled-components';
import { burgerColor } from '../../styles/Themes';
import { NodeInfo } from '../../layouts/navigation/nodeInfo/NodeInfo';
import { SideSettings } from '../../layouts/navigation/sideSettings/SideSettings';
import { Navigation } from '../../layouts/navigation/Navigation';
import { LogoutWrapper } from '../logoutButton';
import { ColorButton } from '../buttons/colorButton/ColorButton';

type StyledProps = {
  open: boolean;
};

const StyledBurger = styled.div<StyledProps>`
  padding: 16px 16px 0;
  background-color: ${burgerColor};
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  ${({ open }) =>
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
      <LogoutWrapper>
        <ColorButton fullWidth={true} withMargin={'16px 0'}>
          Logout
        </ColorButton>
      </LogoutWrapper>
    </StyledBurger>
  );
};
