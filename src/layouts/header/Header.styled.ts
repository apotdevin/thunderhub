import styled, { css } from 'styled-components';
import { headerTextColor, themeColors, mediaWidths } from '../../styles/Themes';
import { SingleLine } from '../../components/generic/Styled';

export const HeaderStyle = styled.div`
  padding: 16px 0;
`;

export const IconPadding = styled.div`
  padding-right: 6px;
  margin-bottom: -4px;
`;

export const HeaderTitle = styled.div<{ withPadding: boolean }>`
  color: ${headerTextColor};
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ withPadding }) =>
    withPadding &&
    css`
      @media (${mediaWidths.mobile}) {
        margin-bottom: 16px;
      }
    `}
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
`;

export const LinkWrapper = styled.div<{ last?: boolean }>`
  color: ${headerTextColor};
  margin: ${({ last }) => (last ? '0 16px 0 4px' : '0 4px')};

  :hover {
    color: ${themeColors.blue2};
  }
`;

export const HeaderLine = styled(SingleLine)<{ loggedIn: boolean }>`
  @media (${mediaWidths.mobile}) {
    ${({ loggedIn }) =>
      !loggedIn &&
      css`
        width: 100%;
        flex-direction: column;
      `}
  }
`;
