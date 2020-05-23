import styled from 'styled-components';
import { mediaWidths } from 'src/styles/Themes';

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
  width: 50%;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  @media (${mediaWidths.mobile}) {
    width: 100%;
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
