import React from "react";
import styled from "styled-components";

const FooterStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  /* background-color: #FB8B23; */
  grid-area: footer;
`;

export const Footer = () => {
  return <FooterStyle>ThunderHub</FooterStyle>;
};
