import React, { useState } from 'react';

import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import Modal from 'src/components/modal/ReactModal';
import numeral from 'numeral';
import { themeColors } from 'src/styles/Themes';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
  SingleLine,
  SubCard,
  DarkSubTitle,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../../pages/settings';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
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
    <SingleButton
      selected={current === value}
      onClick={() => {
        localStorage.setItem(type, value);
        type === 'theme' && dispatch({ type: 'themeChange', theme: value });
        type === 'currency' && dispatch({ type: 'change', currency: value });
        type === 'symbol' && dispatch({ type: 'change', useSatWord: !!value });
      }}
    >
      {title}
    </SingleButton>
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
          <SubCard
            subColor={isCurrent ? themeColors.blue2 : undefined}
            key={key}
          >
            <SingleLine>
              {key}
              <DarkSubTitle>{`${element.symbol} ${numeral(element.last).format(
                '0,0'
              )}`}</DarkSubTitle>
              <ColorButton
                onClick={() => handleFiatClick(key)}
                disabled={isCurrent}
                arrow={true}
              >
                Select
              </ColorButton>
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
            <MultiButton>
              {renderButton('Light', 'light', 'theme', theme)}
              {renderButton('Dark', 'dark', 'theme', theme)}
              {renderButton('Night', 'night', 'theme', theme)}
            </MultiButton>
          </SettingsLine>
          <SettingsLine>
            <Sub4Title>Currency</Sub4Title>
            <MultiButton margin={'0 0 0 16px'}>
              {renderButton('Satoshis', 'sat', 'currency', currency)}
              {renderButton('Bitcoin', 'btc', 'currency', currency)}
              {!dontShow && renderButton('Fiat', 'fiat', 'currency', currency)}
            </MultiButton>
          </SettingsLine>
          {currency === 'sat' && (
            <SettingsLine>
              <Sub4Title>Sat Word Unit</Sub4Title>
              <MultiButton margin={'0 0 0 16px'}>
                {renderButton('Yes', 'yes', 'symbol', useSatWord ? 'yes' : '')}
                {renderButton('No', '', 'symbol', useSatWord ? 'yes' : '')}
              </MultiButton>
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
              <ColorButton onClick={() => changeFiatSet(true)} arrow={true}>
                Change
              </ColorButton>
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
