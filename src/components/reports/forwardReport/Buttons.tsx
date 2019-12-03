import React from 'react';
import { CardTitle, ColorButton } from '../../generic/Styled';

interface ButtonProps {
    isTime: string;
    isType: string;
    setIsTime: (text: string) => void;
    setIsType: (text: string) => void;
    availableTimes: string[];
    mappedTimes: string[];
    availableTypes: string[];
    mappedTypes: string[];
    buttonBorder: string;
}

export const ButtonRow = ({
    isTime,
    setIsTime,
    isType,
    setIsType,
    availableTimes,
    availableTypes,
    mappedTimes,
    mappedTypes,
    buttonBorder,
}: ButtonProps) => {
    const timeIndex = availableTimes.indexOf(isTime);
    const typeIndex = availableTypes.indexOf(isType);

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
        index: number,
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
        </CardTitle>
    );
};
