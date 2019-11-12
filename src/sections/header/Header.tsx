import React from "react";
import styled from "styled-components";

const HeaderStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: red;
  grid-area: header;
`;

export const Header = () => {
  return <HeaderStyle>ThunderHub</HeaderStyle>;
};
