import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Modal from '../../components/modal/ReactModal';
import { themeColors } from '../../styles/Themes';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
  SingleLine,
  SubCard,
  DarkSubTitle,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../pages/SettingsPage';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';
import { cn } from '@/lib/utils';
import { usePriceState, usePriceDispatch } from '../../context/PriceContext';

export const InterfaceSettings = () => {
  const [changeFiat, changeFiatSet] = useState(false);
  const { fiat, prices, dontShow } = usePriceState();
  const { theme, currency, useSatWord } = useConfigState();
  const dispatch = useConfigDispatch();
  const priceDispatch = usePriceDispatch();

  const renderButton = (
    title: string,
    value: string,
    type: string,
    current: string
  ) => (
    <Button
      variant={current === value ? 'default' : 'ghost'}
      className={cn('grow', current !== value && 'text-foreground')}
      onClick={() => {
        localStorage.setItem(type, value);
        if (type === 'theme') dispatch({ type: 'themeChange', theme: value });
        if (type === 'currency') dispatch({ type: 'change', currency: value });
        if (type === 'symbol')
          dispatch({ type: 'change', useSatWord: !!value });
      }}
    >
      {title}
    </Button>
  );

  const handleFiatClick = (fiatCurrency: string) => {
    changeFiatSet(false);
    priceDispatch({ type: 'change', fiat: fiatCurrency });
  };

  const renderFiat = () => {
    const cards: JSX.Element[] = [];
    for (const key in prices) {
      if (Object.prototype.hasOwnProperty.call(prices, key)) {
        const element = prices[key];
        if (!element || !element.last || !element.symbol) return;
        const isCurrent = fiat === key;
        cards.push(
          <SubCard color={isCurrent ? themeColors.blue2 : undefined} key={key}>
            <SingleLine>
              {key}
              <DarkSubTitle>{`${element.symbol} ${Number(
                element.last
              ).toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}`}</DarkSubTitle>
              <Button
                variant="outline"
                onClick={() => handleFiatClick(key)}
                disabled={isCurrent}
              >
                Select <ChevronRight size={18} />
              </Button>
            </SingleLine>
          </SubCard>
        );
      }
    }

    return cards;
  };

  return (
    <>
      <CardWithTitle>
        <SubTitle>Interface</SubTitle>
        <Card>
          <SettingsLine>
            <Sub4Title>Theme</Sub4Title>
            <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
              {renderButton('Light', 'light', 'theme', theme)}
              {renderButton('Dark', 'dark', 'theme', theme)}
            </div>
          </SettingsLine>
          <SettingsLine>
            <Sub4Title>Currency</Sub4Title>
            <div
              className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap"
              style={{ margin: '0 0 0 16px' }}
            >
              {renderButton('Satoshis', 'sat', 'currency', currency)}
              {renderButton('Bitcoin', 'btc', 'currency', currency)}
              {!dontShow && renderButton('Fiat', 'fiat', 'currency', currency)}
            </div>
          </SettingsLine>
          {currency === 'sat' && (
            <SettingsLine>
              <Sub4Title>Sat Word Unit</Sub4Title>
              <div
                className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap"
                style={{ margin: '0 0 0 16px' }}
              >
                {renderButton('Yes', 'yes', 'symbol', useSatWord ? 'yes' : '')}
                {renderButton('No', '', 'symbol', useSatWord ? 'yes' : '')}
              </div>
            </SettingsLine>
          )}
          {currency === 'fiat' && !dontShow && (
            <SettingsLine>
              <SingleLine>
                <Sub4Title>Fiat</Sub4Title>
                <DarkSubTitle
                  withMargin={'0 0 0 8px'}
                >{`(${fiat})`}</DarkSubTitle>
              </SingleLine>
              <Button variant="outline" onClick={() => changeFiatSet(true)}>
                Change <ChevronRight size={18} />
              </Button>
            </SettingsLine>
          )}
        </Card>
      </CardWithTitle>
      <Modal
        isOpen={changeFiat}
        closeCallback={() => {
          changeFiatSet(false);
        }}
      >
        {renderFiat()}
      </Modal>
    </>
  );
};
