import styled from 'styled-components';
import { mediaWidths } from '../../../src/styles/Themes';

const StyledSpacer = styled.div`
  height: 32px;

  @media (${mediaWidths.mobile}) {
    height: 0;
  }
`;

export const Spacer = () => <StyledSpacer />;
