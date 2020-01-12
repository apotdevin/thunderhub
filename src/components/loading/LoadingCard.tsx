import React from 'react';
import { CardWithTitle, CardTitle, SubTitle, Card } from '../generic/Styled';
import ScaleLoader from 'react-spinners/ScaleLoader';
import styled from 'styled-components';
import { useSettings } from '../../context/SettingsContext';
import { textColorMap } from '../../styles/Themes';

const Loading = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

interface LoadingCardProps {
    title?: string;
    noCard?: boolean;
    color?: string;
    noTitle?: boolean;
}

export const LoadingCard = ({
    title = '',
    color,
    noCard = false,
    noTitle = false,
}: LoadingCardProps) => {
    const { theme } = useSettings();

    const loadingColor = color ? color : textColorMap[theme];

    if (noCard) {
        return (
            <Loading>
                <ScaleLoader height={20} color={loadingColor} />
            </Loading>
        );
    }

    if (noTitle) {
        return (
            <Card>
                <Loading>
                    <ScaleLoader height={20} color={loadingColor} />
                </Loading>
            </Card>
        );
    }

    return (
        <CardWithTitle>
            <CardTitle>
                <SubTitle>{title}</SubTitle>
            </CardTitle>
            <Card>
                <Loading>
                    <ScaleLoader height={20} color={loadingColor} />
                </Loading>
            </Card>
        </CardWithTitle>
    );
};
