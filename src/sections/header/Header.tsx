import React from "react";
import styled from "styled-components";

const HeaderStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 0 0;
  /* background-color: #fb8b23; */
  grid-area: header;
`;

const HeaderTitle = styled.div`
  color: #262626;
  font-weight: bolder;
`;

export const Header = () => {
  return (
    <HeaderStyle>
      <HeaderTitle>ThunderHub</HeaderTitle>
    </HeaderStyle>
  );
};
