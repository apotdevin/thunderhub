import React from 'react';
import { SimpleButton, CardTitle } from '../generic/Styled';
import styled from 'styled-components';
import {
    chartSelectedLinkColor,
    chartLinkColor,
    textColor,
} from '../../styles/Themes';

const availableTimes = ['day', 'week', 'month'];
const mappedTimes = ['Day', 'Week', 'Month'];
const availableTypes = ['amount', 'fee', 'tokens'];
const mappedTypes = ['Amount', 'Fees', 'Value'];

const ReportButton = styled(SimpleButton)`
    color: ${chartLinkColor};
    width: 70px;

    &:hover {
        border: 1px solid ${chartSelectedLinkColor};
        color: ${textColor};
    }
`;

export const ButtonRow = ({ isTime, setIsTime, isType, setIsType }: any) => {
    const timeIndex = availableTimes.indexOf(isTime);
    const typeIndex = availableTypes.indexOf(isType);

    const toggleButtons = (array: string[], index: number) => {
        if (index === array.length - 1) {
            return array[0];
        }
        return array[index + 1];
    };

    const buttonToShow = (
        setFn: (text: string) => {},
        array: string[],
        mapped: string[],
        index: number,
    ) => {
        return (
            <ReportButton onClick={() => setFn(toggleButtons(array, index))}>
                {mapped[index]}
            </ReportButton>
        );
    };

    return (
        <CardTitle>
            {buttonToShow(setIsTime, availableTimes, mappedTimes, timeIndex)}
            {buttonToShow(setIsType, availableTypes, mappedTypes, typeIndex)}
        </CardTitle>
    );
};
