import { Channels } from '../../../../views/channels/channels/Channels';
import styled from 'styled-components';

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
      <Channels />
    </S.wrapper>
  );
};
