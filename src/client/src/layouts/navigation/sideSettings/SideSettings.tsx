import { FC } from 'react';
import {
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LucideProps,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { SatoshiSymbol } from '../../../components/satoshi/Satoshi';
import { Separation, SingleLine } from '../../../components/generic/Styled';
import {
  useConfigState,
  useConfigDispatch,
} from '../../../context/ConfigContext';
import { usePriceState } from '../../../context/PriceContext';

type Icon = FC<LucideProps>;

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
        return <div className="mt-0.5 font-bold">{text}</div>;
      }
      if (type === 'theme' && SideIcon) {
        return <SideIcon size={18} />;
      }
      return '';
    };

    const selected =
      (type === 'currency' ? currency === value : theme === value) || on;

    return (
      <div
        className={cn(
          'flex justify-center items-center outline-none w-[30px] h-[30px] rounded-full mx-[5px] cursor-pointer',
          'sm:hover:bg-primary sm:hover:text-primary-foreground',
          selected && 'bg-muted'
        )}
        onClick={() => {
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
      </div>
    );
  };

  const renderContent = () => {
    if (!sidebar) {
      return (
        <>
          <Separation lineColor={'grey'} />
          <div className="my-[5px] flex justify-center items-center w-full">
            {renderIcon('currency', currency, correctMap[currency], true)}
          </div>
          <div className="my-[5px] flex justify-center items-center w-full">
            {renderIcon(
              'theme',
              getNextValue(themeArray, theme),
              '',
              true,
              getNextValue(themeArray, theme) === 'light' ? Sun : Moon
            )}
          </div>
        </>
      );
    }
    return (
      <>
        <Separation lineColor={'grey'} />
        <div className="my-[5px] flex justify-center items-center">
          {renderIcon('currency', 'sat', 'S')}
          {renderIcon('currency', 'btc', '₿')}
          {!dontShow && renderIcon('currency', 'fiat', 'F')}
        </div>
        <div className="my-[5px] flex justify-center items-center">
          {renderIcon('theme', 'light', '', false, Sun)}
          {renderIcon('theme', 'dark', '', false, Moon)}
        </div>
      </>
    );
  };

  if (isBurger) {
    return (
      <SingleLine className="my-4">
        <div className="my-[5px] flex justify-center items-center">
          {renderIcon('currency', 'sat', 'S')}
          {renderIcon('currency', 'btc', '₿')}
          {!dontShow && renderIcon('currency', 'fiat', 'F')}
        </div>
        <div className="my-[5px] flex justify-center items-center">
          {renderIcon('theme', 'light', '', false, Sun)}
          {renderIcon('theme', 'dark', '', false, Moon)}
        </div>
      </SingleLine>
    );
  }

  return (
    <>
      {renderContent()}
      <div
        className={cn(
          'my-[5px] flex justify-center items-center',
          !sidebar && 'w-full'
        )}
      >
        <div
          className={cn(
            'flex justify-center items-center outline-none w-[30px] h-[30px] rounded-full mx-[5px] cursor-pointer',
            'sm:hover:bg-primary sm:hover:text-primary-foreground',
            'bg-muted'
          )}
          onClick={() => {
            localStorage.setItem('sidebar', (!sidebar).toString());
            dispatch({ type: 'change', sidebar: !sidebar });
          }}
        >
          {sidebar ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>
    </>
  );
};
