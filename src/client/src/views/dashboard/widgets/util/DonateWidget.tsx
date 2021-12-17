import { Heart } from 'react-feather';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { useDashDispatch } from '../../../../context/DashContext';
import styled from 'styled-components';

const S = {
  wrapper: styled.div`
    height: 100%;
    width: 100%;
  `,
  title: styled.div`
    font-size: 14px;
    margin-left: 4px;
  `,
  row: styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
  `,
};

export const DonateWidget = () => {
  const dispatch = useDashDispatch();

  return (
    <S.wrapper>
      <ColorButton
        fullWidth={true}
        onClick={() => dispatch({ type: 'openModal', modalType: 'donate' })}
      >
        <S.row>
          <Heart size={18} />
          <S.title>Donate</S.title>
        </S.row>
      </ColorButton>
    </S.wrapper>
  );
};
