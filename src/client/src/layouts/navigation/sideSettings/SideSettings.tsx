import { FC } from 'react';
import {
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LucideProps,
} from 'lucide-react';
import styled from 'styled-components';
import { SatoshiSymbol } from '../../../components/satoshi/Satoshi';
import { Separation, SingleLine } from '../../../components/generic/Styled';
import {
  useConfigState,
  useConfigDispatch,
} from '../../../context/ConfigContext';
import {
  progressBackground,
  iconButtonHover,
  inverseTextColor,
  unSelectedNavButton,
} from '../../../styles/Themes';
import { usePriceState } from '../../../context/PriceContext';

type Icon = FC<LucideProps>;

const SelectedIcon = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  margin: 0 5px;
  cursor: pointer;

  @media (min-width: 579px) {
    &:hover {
      background-color: ${iconButtonHover};
      color: ${inverseTextColor};
    }
  }
  background-color: ${({ selected }) => (selected ? progressBackground : '')};
`;

const Symbol = styled.div`
  margin-top: 2px;
  font-weight: 700;
`;

const IconRow = styled.div<{ center?: boolean }>`
  margin: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ center }) => center && 'width: 100%'}
`;

const BurgerPadding = styled(SingleLine)`
  margin: 16px 0;
`;

const currencyArray = ['sat', 'btc', 'fiat'];
const currencyNoFiatArray = ['sat', 'btc'];

const themeArray = ['light', 'dark'];

const currencyMap: { [key: string]: string } = {
  sat: 'S',
  btc: '₿',
  fiat: 'F',
};
const currencyNoFiatMap: { [key: string]: string } = {
  sat: 'S',
  btc: '₿',
};

const getNextValue = (array: string[], current: string): string => {
  const length = array.length;
  const index = array.indexOf(current);

  let value = '';
  if (index + 1 === length) {
    value = array[0];
  } else {
    value = array[index + 1];
  }

  return value;
};

interface SideSettingsProps {
  isBurger?: boolean;
}

export const SideSettings = ({ isBurger }: SideSettingsProps) => {
  const { dontShow } = usePriceState();
  const { theme, currency, sidebar } = useConfigState();
  const dispatch = useConfigDispatch();

  const correctMap = dontShow ? currencyNoFiatMap : currencyMap;
  const correctArray = dontShow ? currencyNoFiatArray : currencyArray;

  const renderIcon = (
    type: string,
    value: string,
    text: string,
    on = false,
    SideIcon?: Icon
  ) => {
    const renderText = () => {
      if (type === 'currency') {
        if (text === 'S') {
          return <SatoshiSymbol />;
        }
        return <Symbol>{text}</Symbol>;
      }
      if (type === 'theme' && SideIcon) {
        return <SideIcon size={18} />;
      }
      return '';
    };
    return (
      <SelectedIcon
        selected={
          (type === 'currency' ? currency === value : theme === value) || on
        }
        onClick={() => {
          localStorage.setItem(type, value);
          if (type === 'currency') {
            dispatch({
              type: 'change',
              currency:
                sidebar || isBurger ? value : getNextValue(correctArray, value),
            });
          }
          if (type === 'theme') dispatch({ type: 'themeChange', theme: value });
        }}
      >
        {renderText()}
      </SelectedIcon>
    );
  };

  const renderContent = () => {
    if (!sidebar) {
      return (
        <>
          <Separation lineColor={unSelectedNavButton} />
          <IconRow center={true}>
            {renderIcon('currency', currency, correctMap[currency], true)}
          </IconRow>
          <IconRow center={true}>
            {renderIcon(
              'theme',
              getNextValue(themeArray, theme),
              '',
              true,
              getNextValue(themeArray, theme) === 'light' ? Sun : Moon
            )}
          </IconRow>
        </>
      );
    }
    return (
      <>
        <Separation lineColor={unSelectedNavButton} />
        <IconRow>
          {renderIcon('currency', 'sat', 'S')}
          {renderIcon('currency', 'btc', '₿')}
          {!dontShow && renderIcon('currency', 'fiat', 'F')}
        </IconRow>
        <IconRow>
          {renderIcon('theme', 'light', '', false, Sun)}
          {renderIcon('theme', 'dark', '', false, Moon)}
        </IconRow>
      </>
    );
  };

  if (isBurger) {
    return (
      <BurgerPadding>
        <IconRow>
          {renderIcon('currency', 'sat', 'S')}
          {renderIcon('currency', 'btc', '₿')}
          {!dontShow && renderIcon('currency', 'fiat', 'F')}
        </IconRow>
        <IconRow>
          {renderIcon('theme', 'light', '', false, Sun)}
          {renderIcon('theme', 'dark', '', false, Moon)}
        </IconRow>
      </BurgerPadding>
    );
  }

  return (
    <>
      {renderContent()}
      <IconRow center={!sidebar}>
        <SelectedIcon
          selected={true}
          onClick={() => {
            localStorage.setItem('sidebar', (!sidebar).toString());
            dispatch({ type: 'change', sidebar: !sidebar });
          }}
        >
          {sidebar ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </SelectedIcon>
      </IconRow>
    </>
  );
};
