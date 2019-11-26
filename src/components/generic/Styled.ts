import styled from "styled-components";
import {
  cardColor,
  cardBorderColor,
  subCardColor,
  smallLinkColor,
  chartLinkColor,
  chartSelectedLinkColor
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

export const ChartLink = styled.button`
  text-decoration: none;
  color: ${({ selected }: { selected: boolean }) =>
    selected ? chartSelectedLinkColor : chartLinkColor};
  background-color: transparent;
  cursor: pointer;
  border: 0;
  padding: 0;
  font-weight: bold;

  &:hover {
    color: #08979c;
  }
`;

export const ChartRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 3px;
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SubTitle = styled.h3`
  margin: 0;
`;

export const Sub4Title = styled.h4`
  margin: 10px 0;
`;

export const CardContent = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
`;

export const ChannelRow = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
