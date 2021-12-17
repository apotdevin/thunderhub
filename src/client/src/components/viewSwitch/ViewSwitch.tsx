import React from 'react';
import styled from 'styled-components';
import { mediaWidths } from '../../styles/Themes';

const HideMobile = styled.div`
  @media (${mediaWidths.mobile}) {
    display: none;
  }
`;

const HideDesktop = styled.div`
  display: none;
  @media (${mediaWidths.mobile}) {
    display: unset;
  }
`;

interface ViewSwitchProps {
  hideMobile?: boolean;
}

export const ViewSwitch: React.FC<ViewSwitchProps> = ({
  hideMobile,
  children,
}) => {
  return hideMobile ? (
    <HideMobile>{children}</HideMobile>
  ) : (
    <HideDesktop>{children}</HideDesktop>
  );
};
