import React, { useState } from 'react';
import { Input } from 'components/input/Input';
import { Line, StyledTitle } from '../Auth.styled';
import { SingleLine, Sub4Title } from 'components/generic/Styled';
import {
    MultiButton,
    SingleButton,
} from 'components/buttons/multiButton/MultiButton';
import { RiskCheckboxAndConfirm } from './Checkboxes';

interface AuthProps {
    available: number;
    handleSet?: ({
        name,
        host,
        admin,
        viewOnly,
        cert,
    }: {
        name?: string;
        host?: string;
        admin?: string;
        viewOnly?: string;
        cert?: string;
    }) => void;
}

export const LoginForm = ({ available, handleSet }: AuthProps) => {
    const [isViewOnly, setIsViewOnly] = useState(true);
    const [checked, setChecked] = useState(false);

    const [name, setName] = useState('');
    const [host, setHost] = useState('');
    const [admin, setAdmin] = useState('');
    const [viewOnly, setRead] = useState('');
    const [cert, setCert] = useState('');

    const handleClick = () => {
        handleSet && handleSet({ name, host, admin, viewOnly, cert });
    };

    const canConnect =
        name !== '' &&
        host !== '' &&
        (admin !== '' || viewOnly !== '') &&
        !!available &&
        checked;
    return (
        <>
            <SingleLine>
                <Sub4Title>Type of Account:</Sub4Title>
                <MultiButton>
                    <SingleButton
                        selected={isViewOnly}
                        onClick={() => setIsViewOnly(true)}
                    >
                        ViewOnly
                    </SingleButton>
                    <SingleButton
                        selected={!isViewOnly}
                        onClick={() => setIsViewOnly(false)}
                    >
                        Admin
                    </SingleButton>
                </MultiButton>
            </SingleLine>
            <Line>
                <StyledTitle>Name:</StyledTitle>
                <Input
                    placeholder={'Name for this node (e.g.: My Awesome Node)'}
                    onChange={e => setName(e.target.value)}
                />
            </Line>
            <Line>
                <StyledTitle>Host:</StyledTitle>
                <Input
                    placeholder={'Url and port (e.g.: www.node.com:443)'}
                    onChange={e => setHost(e.target.value)}
                />
            </Line>
            {!isViewOnly && (
                <Line>
                    <StyledTitle>Admin:</StyledTitle>
                    <Input
                        placeholder={'Base64 or HEX Admin macaroon'}
                        onChange={e => setAdmin(e.target.value)}
                    />
                </Line>
            )}
            <Line>
                <StyledTitle>Readonly:</StyledTitle>
                <Input
                    placeholder={'Base64 or HEX Readonly macaroon'}
                    onChange={e => setRead(e.target.value)}
                />
            </Line>
            <Line>
                <StyledTitle>Certificate:</StyledTitle>
                <Input
                    placeholder={'Base64 or HEX TLS Certificate'}
                    onChange={e => setCert(e.target.value)}
                />
            </Line>
            <RiskCheckboxAndConfirm
                disabled={!canConnect}
                handleClick={handleClick}
                checked={checked}
                onChange={setChecked}
            />
        </>
    );
};
