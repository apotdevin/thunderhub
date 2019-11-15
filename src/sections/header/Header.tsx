import React from "react";
import styled from "styled-components";
import { textColor } from "../../styles/Themes";

const HeaderStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 0 0;
  /* background-color: #fb8b23; */
  grid-area: header;
`;

const HeaderTitle = styled.div`
  color: ${textColor};
  font-weight: bolder;
`;

export const Header = () => {
  return (
    <HeaderStyle>
      <HeaderTitle>ThunderHub</HeaderTitle>
    </HeaderStyle>
  );
};
