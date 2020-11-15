import React, { useEffect, useState } from 'react';
import { useGetForwardsPastDaysQuery } from 'src/graphql/queries/__generated__/getForwardsPastDays.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { Forward } from 'src/graphql/types';
import { ParentSize } from '@visx/responsive';
import {
  ChordGraph,
  SingleGroupProps,
  SingleChordProps,
} from 'src/components/chord';
import styled from 'styled-components';
import { renderLine } from 'src/components/generic/helpers';
import { DarkSubTitle } from 'src/components/generic/Styled';
import { ReportType } from '../home/reports/forwardReport/ForwardReport';
import { getChordMatrix } from './helpers';

const Wrapper = styled.div`
  height: 800px;
  width: 100%;
`;

const Center = styled.div`
  width: '100%';
  text-align: center;
`;

type SelectedProps =
  | { type: 'group'; group: SingleGroupProps }
  | { type: 'chord'; chord: SingleChordProps }
  | null;

const getTitle = (order: ReportType) => {
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
  order: ReportType;
}) => {
  const [selected, setSelected] = useState<SelectedProps>();

  useEffect(() => {
    setSelected(null);
  }, [order]);

  const { data, loading } = useGetForwardsPastDaysQuery({
    ssr: false,
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data?.getForwardsPastDays?.length) {
    return null;
  }

  const { matrix, uniqueNodes } = getChordMatrix(
    order,
    data.getForwardsPastDays as Forward[]
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
          {renderLine('Node', uniqueNodes[selected.group.index])}
          {renderLine(getTitle(order), selected.group.value)}
        </>
      );
    }
    if (selected.type === 'chord') {
      return (
        <>
          {renderLine(
            'Flow between',
            `${uniqueNodes[selected.chord.source.index]} - ${
              uniqueNodes[selected.chord.target.index]
            }`
          )}
          {renderLine(getTitle(order), selected.chord.source.value)}
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
