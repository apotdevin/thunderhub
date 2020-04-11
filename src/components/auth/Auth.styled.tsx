import styled from 'styled-components';
import { Sub4Title } from '../generic/Styled';
import { fontColors, textColor } from '../../styles/Themes';

export const Line = styled.div`
  margin: 16px 0;
`;

export const StyledTitle = styled(Sub4Title)`
  text-align: left;
  width: 100%;
  margin-bottom: 0px;
`;

export const CheckboxText = styled.div`
  font-size: 13px;
  color: ${fontColors.grey7};
  text-align: justify;
`;

export const StyledContainer = styled.div`
  color: ${textColor};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-right: 32px;
  margin: 32px 0 8px;
`;

export const FixedWidth = styled.div`
  height: 18px;
  width: 18px;
  margin: 0px;
  margin-right: 8px;
`;

export const QRTextWrapper = styled.div`
  display: flex;
  margin: 16px 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
