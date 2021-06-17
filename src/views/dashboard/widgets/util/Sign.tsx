import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { useDashDispatch } from 'src/context/DashContext';
import styled from 'styled-components';

const S = {
  wrapper: styled.div`
    height: 100%;
    width: 100%;
  `,
};

export const SignWidget = () => {
  const dispatch = useDashDispatch();

  return (
    <S.wrapper>
      <ColorButton
        fullWidth={true}
        onClick={() =>
          dispatch({ type: 'openModal', modalType: 'signMessage' })
        }
      >
        Sign Message
      </ColorButton>
    </S.wrapper>
  );
};
