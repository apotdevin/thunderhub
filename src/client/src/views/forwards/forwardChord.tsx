import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { Forward } from '../../graphql/types';
import { ParentSize } from '@visx/responsive';
import {
  ChordGraph,
  SingleGroupProps,
  SingleChordProps,
} from '../../components/chord';
import styled from 'styled-components';
import { renderLine } from '../../components/generic/helpers';
import { DarkSubTitle } from '../../components/generic/Styled';
import { mediaWidths } from '../../styles/Themes';
import { usePriceState } from '../../context/PriceContext';
import { getPrice } from '../../components/price/Price';
import { useConfigState } from '../../context/ConfigContext';
import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { ChannelAlias } from '../home/reports/forwardReport/ChannelAlias';
import { getChordMatrix } from './helpers';

const Wrapper = styled.div`
  height: 800px;
  width: 100%;

  @media (${mediaWidths.mobile}) {
    height: 300px;
  }
`;

const Center = styled.div`
  width: '100%';
  text-align: center;
`;

type SelectedProps =
  | { type: 'group'; group: SingleGroupProps }
  | { type: 'chord'; chord: SingleChordProps }
  | null;

const getTitle = (order: string) => {
  switch (order) {
    case 'fee':
      return 'Total Fees (sats)';
    case 'tokens':
      return 'Total Tokens (sats)';
    default:
      return 'Total Amount (Forwards)';
  }
};

export const ForwardChord = ({
  days,
  order,
}: {
  days: number;
  order: string;
}) => {
  const [selected, setSelected] = useState<SelectedProps>();

  useEffect(() => {
    setSelected(null);
  }, [order]);

  const { data, loading } = useGetForwardsQuery({
    ssr: false,
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  if (loading || !data?.getForwards?.length) {
    return null;
  }

  const { matrix, uniqueNodes } = getChordMatrix(
    order,
    data.getForwards as Forward[]
  );

  const handleGroupClick = (group: SingleGroupProps) => {
    setSelected({ type: 'group', group });
  };
  const handleChordClick = (chord: SingleChordProps) => {
    setSelected({ type: 'chord', chord });
  };

  const renderInfo = () => {
    if (!selected) {
      return (
        <Center>
          <DarkSubTitle>Click the graph for specific info!</DarkSubTitle>
        </Center>
      );
    }
    if (selected.type === 'group') {
      return (
        <>
          {renderLine(
            'With',
            <ChannelAlias id={uniqueNodes[selected.group.index]} />
          )}
          {renderLine('Channel Id', uniqueNodes[selected.group.index])}
          {renderLine(
            getTitle(order),
            format({ amount: selected.group.value, noUnit: order === 'amount' })
          )}
        </>
      );
    }
    if (selected.type === 'chord') {
      return (
        <>
          {renderLine(
            'Between',
            <>
              <ChannelAlias id={uniqueNodes[selected.chord.source.index]} />
              {` - `}
              <ChannelAlias id={uniqueNodes[selected.chord.target.index]} />
            </>
          )}
          {renderLine(
            'Channel Ids',
            `${uniqueNodes[selected.chord.source.index]} - ${
              uniqueNodes[selected.chord.target.index]
            }`
          )}
          {renderLine(
            getTitle(order),
            format({
              amount: selected.chord.source.value,
              noUnit: order === 'amount',
            })
          )}
        </>
      );
    }
  };

  return (
    <>
      {renderInfo()}
      <Wrapper>
        <ParentSize>
          {parent => (
            <ChordGraph
              matrix={matrix}
              width={parent.width}
              height={parent.height}
              groupCallback={handleGroupClick}
              chordCallback={handleChordClick}
            />
          )}
        </ParentSize>
      </Wrapper>
    </>
  );
};
