import React from 'react';
import { Sub4Title, SubTitle } from '../../generic/Styled';
import zxcvbn from 'zxcvbn';
import styled from 'styled-components';
import { progressBackground } from '../../../styles/Themes';
import { ColorButton } from '../../buttons/colorButton/ColorButton';
import { Input } from 'components/input/Input';
import { Line } from '../Auth.styled';

const Progress = styled.div`
    width: 100%;
    background: ${progressBackground};
`;

interface ProgressBar {
    percent: number;
    barColor?: string;
}

const ProgressBar = styled.div`
    height: 10px;
    background-color: ${({ barColor }: ProgressBar) =>
        barColor ? barColor : 'blue'};
    width: ${({ percent }: ProgressBar) => `${percent}%`};
`;

const getColor = (percent: number) => {
    switch (true) {
        case percent < 20:
            return '#ff4d4f';
        case percent < 40:
            return '#ff7a45';
        case percent < 60:
            return '#ffa940';
        case percent < 80:
            return '#bae637';
        case percent <= 100:
            return '#73d13d';
        default:
            return '';
    }
};

interface PasswordProps {
    isPass: string;
    setPass: (pass: string) => void;
    callback: () => void;
    loading: boolean;
}

export const PasswordInput = ({
    isPass = '',
    setPass,
    callback,
    loading = false,
}: PasswordProps) => {
    const strength = (100 * Math.min(zxcvbn(isPass).guesses_log10, 40)) / 40;
    const needed = 20;
    return (
        <>
            <SubTitle>Please Input a Password</SubTitle>
            <Line>
                <Sub4Title>Password:</Sub4Title>
                <Input onChange={e => setPass(e.target.value)} />
            </Line>
            <Line>
                <Sub4Title>Strength:</Sub4Title>
                <Progress>
                    <ProgressBar
                        percent={strength}
                        barColor={getColor(strength)}
                    />
                </Progress>
            </Line>
            <ColorButton
                disabled={strength < needed}
                onClick={callback}
                withMargin={'32px 0 0'}
                fullWidth={true}
                arrow={true}
                loading={loading}
            >
                Connect
            </ColorButton>
        </>
    );
};
