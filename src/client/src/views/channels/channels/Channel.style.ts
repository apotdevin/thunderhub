import styled, { css } from 'styled-components';
import {
  mediaWidths,
  colorButtonBackground,
  textColor,
  colorButtonBorder,
  chartColors,
  disabledTextColor,
} from '../../../styles/Themes';

export const ChannelIconPadding = styled.div`
  display: flex;
  margin-left: 8px;
`;

export const ChannelStatsColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const ChannelStatsLine = styled.div`
  width: 100%;
  display: flex;
`;

export const ChannelBarSide = styled.div`
  display: flex;
  align-items: center;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
  }
`;

export const ChannelNodeTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (${mediaWidths.mobile}) {
    text-align: center;
    margin-bottom: 8px;
  }
`;

export const ChannelAlias = styled.div<{ textColor?: string }>`
  ${({ textColor }) => textColor && `color: ${textColor}`}
`;

export const ChannelSingleLine = styled.div`
  display: flex;
  align-items: center;
`;

export const IconCursor = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 8px;
`;

export const ChannelBalanceRow = styled.div`
  display: flex;

  @media (${mediaWidths.mobile}) {
    width: 100%;
  }
`;

type BalanceButtonProps = {
  selected?: boolean;
  disabled?: boolean;
};

export const ChannelBalanceButton = styled.button<BalanceButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  padding: 6px 8px;
  border: none;
  text-decoration: none;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 14px;
  box-sizing: border-box;
  margin-left: 8px;
  color: ${({ disabled }) => (disabled ? disabledTextColor : textColor)};
  ${({ disabled }) =>
    !disabled &&
    css`
      cursor: pointer;
    `}
  background-color: ${({ selected }) =>
    selected ? chartColors.orange : colorButtonBackground};

  @media (${mediaWidths.mobile}) {
    margin: 8px 8px 16px;
    width: 100%;
  }

  :hover {
    background-color: ${({ selected, disabled }) =>
      disabled
        ? colorButtonBackground
        : selected
        ? chartColors.orange2
        : colorButtonBorder};
  }
`;

export const ChannelGoToToast = styled.div`
  width: 100%;
  text-align: center;
`;

export const WumboTag = styled.div`
  width: 100%;
  border-radius: 4px;
  border: 1px solid gold;
  text-align: center;
  padding: 2px 0;
`;

export const LineGrid = styled.div<{ template?: string }>`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: ${({ template }) => template || '2fr 3fr'};

  @media (${mediaWidths.mobile}) {
    grid-template-columns: 1fr;
  }
`;
