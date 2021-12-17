import { Star, Sun, Moon } from 'react-feather';
import { SingleButton } from '../../../../components/buttons/multiButton/MultiButton';
import {
  useConfigDispatch,
  useConfigState,
} from '../../../../context/ConfigContext';
import styled from 'styled-components';

const S = {
  wrapper: styled.div`
    overflow: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  `,
};

export const ThemeSetting = () => {
  const { theme } = useConfigState();
  const dispatch = useConfigDispatch();

  const handleDispatch = (theme: string) =>
    dispatch({ type: 'themeChange', theme });

  return (
    <S.wrapper>
      <SingleButton
        selected={theme === 'light'}
        onClick={() => handleDispatch('light')}
      >
        <Sun size={16} />
      </SingleButton>
      <SingleButton
        selected={theme === 'dark'}
        onClick={() => handleDispatch('dark')}
      >
        <Moon size={16} />
      </SingleButton>
      <SingleButton
        selected={theme === 'night'}
        onClick={() => handleDispatch('night')}
      >
        <Star size={16} />
      </SingleButton>
    </S.wrapper>
  );
};

export const CurrencySetting = () => {
  const { currency } = useConfigState();
  const dispatch = useConfigDispatch();

  const handleDispatch = (currency: string) =>
    dispatch({ type: 'change', currency });

  return (
    <S.wrapper>
      <SingleButton
        selected={currency === 'sat'}
        onClick={() => handleDispatch('sat')}
      >
        Sat
      </SingleButton>
      <SingleButton
        selected={currency === 'btc'}
        onClick={() => handleDispatch('btc')}
      >
        Btc
      </SingleButton>
      <SingleButton
        selected={currency === 'fiat'}
        onClick={() => handleDispatch('fiat')}
      >
        Fiat
      </SingleButton>
    </S.wrapper>
  );
};
