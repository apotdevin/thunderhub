import styled from 'styled-components';
import { chartColors } from 'src/styles/Themes';

export const BetaNotification = styled.div`
  width: 100%;
  text-align: center;
  background-color: ${chartColors.orange};
  border-radius: 4px;
  color: black;
  margin-bottom: 16px;
  padding: 4px 0;
`;
