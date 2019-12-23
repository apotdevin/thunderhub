import React from 'react';
import { CardWithTitle, CardTitle, SubTitle, Card } from '../generic/Styled';
import ScaleLoader from 'react-spinners/ScaleLoader';
import styled from 'styled-components';

const Loading = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

interface LoadingCardProps {
    title: string;
    noCard?: boolean;
    color?: string;
}

export const LoadingCard = ({
    title,
    color = 'white',
    noCard = false,
}: LoadingCardProps) => {
    if (noCard) {
        return (
            <Loading>
                <ScaleLoader height={20} color={color} />
            </Loading>
        );
    }
    return (
        <CardWithTitle>
            <CardTitle>
                <SubTitle>{title}</SubTitle>
            </CardTitle>
            <Card>
                <Loading>
                    <ScaleLoader height={20} color={color} />
                </Loading>
            </Card>
        </CardWithTitle>
    );
};
