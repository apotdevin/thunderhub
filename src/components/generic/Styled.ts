import styled from "styled-components";
import { cardColor, cardBorderColor } from "../../styles/Themes";

export const Card = styled.div`
  padding: 10px;
  background: ${cardColor};
  /* background: linear-gradient(#fff, #fcfcfc); */
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  border: 1px solid ${cardBorderColor};
  margin-bottom: ${(props: { bottom?: string }) => props.bottom};
  width: 100%;
`;
