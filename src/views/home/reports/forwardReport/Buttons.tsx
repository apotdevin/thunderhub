import React from 'react';
import { CardTitle, ColorButton } from '../../../../components/generic/Styled';

interface ButtonProps {
  isTime: string;
  isType: string;
  // isGraph?: string;
  setIsTime: (text: string) => void;
  setIsType: (text: string) => void;
  // setIsGraph?: (text: string) => void;
}

const availableTimes = ['day', 'week', 'month'];
const mappedTimes = ['Day', 'Week', 'Month'];
const availableTypes = ['amount', 'tokens'];
const mappedTypes = ['Amount', 'Value'];
// const availableGraphs = ['waterfall', 'bar'];
// const mappedGraphs = ['Waterfall', 'Bar'];
const buttonBorder = '#FD5F00';

export const ButtonRow = ({
  isTime,
  setIsTime,
  isType,
  setIsType,
}: // isGraph = 'bar',
// setIsGraph,
ButtonProps) => {
  const timeIndex = availableTimes.indexOf(isTime);
  const typeIndex = availableTypes.indexOf(isType);
  // const graphIndex = availableGraphs.indexOf(isGraph);

  const toggleButtons = (array: string[], index: number) => {
    if (index === array.length - 1) {
      return array[0];
    }
    return array[index + 1];
  };

  const buttonToShow = (
    setFn: (text: string) => void,
    array: string[],
    mapped: string[],
    index: number
  ) => {
    return (
      <ColorButton
        color={buttonBorder}
        onClick={() => setFn(toggleButtons(array, index))}
      >
        {mapped[index]}
      </ColorButton>
    );
  };

  return (
    <CardTitle>
      {buttonToShow(setIsTime, availableTimes, mappedTimes, timeIndex)}
      {buttonToShow(setIsType, availableTypes, mappedTypes, typeIndex)}
      {/* {setIsGraph &&
                buttonToShow(
                    setIsGraph,
                    availableGraphs,
                    mappedGraphs,
                    graphIndex,
                )} */}
    </CardTitle>
  );
};
