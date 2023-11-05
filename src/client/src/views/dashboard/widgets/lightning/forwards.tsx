import styled from 'styled-components';
import { ForwardsList } from '../../../forwards';

const S = {
  wrapper: styled.div`
    width: 100%;
    height: 100%;
  `,
  table: styled.div`
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
  `,
  title: styled.h4`
    font-weight: 900;
    width: 100%;
    text-align: center;
    margin: 8px 0;
  `,
};

export const ForwardListWidget = () => {
  return (
    <S.wrapper>
      <S.title>Forwards</S.title>
      <S.table>
        <ForwardsList days={7} />
      </S.table>
    </S.wrapper>
  );
};
