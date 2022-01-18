import styled from 'styled-components';
import { ChannelTable } from '../../../channels/channels/ChannelTable';

const S = {
  wrapper: styled.div`
    height: 100%;
    width: 100%;
    overflow: auto;
  `,
};

export const ChannelListWidget = () => {
  return (
    <S.wrapper>
      <ChannelTable />
    </S.wrapper>
  );
};
