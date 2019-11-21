import styled from "styled-components";
import {
  cardColor,
  cardBorderColor,
  subCardColor,
  smallLinkColor
} from "../../styles/Themes";

export const Card = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background: ${cardColor};
  /* background: linear-gradient(#fff, #fcfcfc); */
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  border: 1px solid ${cardBorderColor};
  margin-bottom: ${(props: { bottom?: string }) => props.bottom};
  width: 100%;
  border-left: ${(props: { color?: string }) =>
    props.color ? `2px solid ${props.color}` : ""};
`;

export const Separation = styled.div`
  height: ${({ height }: { height?: number }) => (height ? height : "2")}px;
  background-color: #e6e6e6;
  width: 100%;
  margin: 20px 0;
`;

export const SubCard = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background: ${subCardColor};
  /* padding-bottom: 5px; */
  border: 1px solid ${cardBorderColor};
  border-left: ${(props: { color?: string }) =>
    props.color ? `2px solid ${props.color}` : ""};

  &:hover {
    box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  }
`;

export const SmallLink = styled.a`
  text-decoration: none;
  color: ${smallLinkColor};

  &:hover {
    text-decoration: underline;
  }
`;
