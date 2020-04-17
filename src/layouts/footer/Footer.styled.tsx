import styled from 'styled-components';
import { headerTextColor, fontColors, mediaWidths } from '../../styles/Themes';
import { HomeButton } from '../../views/homepage/HomePage.styled';

export const FooterWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 250px;
`;

export const FooterStyle = styled.div`
  padding: 40px 0 16px;
  min-height: 250px;
  color: ${headerTextColor};
  display: flex;
  justify-content: space-between;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
    padding: 0 0 40px;
    justify-content: center;
    align-items: center;
  }
`;

export const SideFooter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media (${mediaWidths.mobile}) {
    width: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

export const RightFooter = styled(SideFooter)`
  justify-content: flex-start;
  align-items: flex-end;
  width: 80%;

  @media (${mediaWidths.mobile}) {
    margin-top: 32px;
  }
`;

export const Title = styled.div`
  font-weight: 800;
  color: ${headerTextColor};
`;

export const SideText = styled.p`
  font-size: 14px;
  color: ${fontColors.grey7};

  @media (${mediaWidths.mobile}) {
    padding-right: 0;
  }
`;

export const CopyrightText = styled(SideText)`
  font-size: 12px;
  color: ${fontColors.blue};
`;

export const StyledRouter = styled.div`
  margin-top: 16px;

  ${HomeButton} {
    font-size: 14px;
  }
`;

export const Line = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

export const Version = styled.div`
  font-size: 12px;
  margin-left: 8px;
`;
