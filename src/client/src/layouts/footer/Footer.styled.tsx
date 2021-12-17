import styled from 'styled-components';
import { headerTextColor, fontColors, mediaWidths } from '../../styles/Themes';

export const FooterWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 120px;
`;

export const FooterStyle = styled.div`
  padding: 16px 0;
  min-height: 120px;
  color: ${headerTextColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (${mediaWidths.mobile}) {
    padding-bottom: 32px;
  }
`;

export const SideFooter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media (${mediaWidths.mobile}) {
    justify-content: center;
    align-items: center;
  }
`;

export const RightFooter = styled(SideFooter)`
  justify-content: flex-start;
  align-items: flex-end;

  @media (${mediaWidths.mobile}) {
    margin: 16px 0;
  }
`;

export const Title = styled.div`
  font-weight: 800;
  color: ${headerTextColor};
`;

export const SideText = styled.div`
  font-size: 14px;
  color: ${fontColors.grey7};

  @media (${mediaWidths.mobile}) {
    padding-right: 0;
  }
`;

export const Line = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Version = styled.div`
  font-size: 12px;
  margin-left: 8px;
`;

export const FooterRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const FooterCenterText = styled(SideText)`
  width: 100%;
  text-align: center;
  margin-top: 16px;
`;
