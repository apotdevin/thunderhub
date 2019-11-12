import styled from "styled-components";

export const Card = styled.div`
  padding: 10px;
  background-color: #fff;
  background: linear-gradient(#fff, #fcfcfc);
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  border: 1px solid #e6e6e6;
  margin-bottom: ${(props: { bottom?: string }) => props.bottom};
  width: 100%;
`;
