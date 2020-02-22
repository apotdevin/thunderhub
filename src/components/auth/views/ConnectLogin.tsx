import React, { useState } from 'react';
import { getAuthLnd, getBase64CertfromDerFormat } from '../../../utils/auth';
import { Input } from 'components/input/Input';
import { Line, StyledTitle } from '../Auth.styled';
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

export const ConnectLoginForm = ({ available, handleSet }: AuthProps) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [checked, setChecked] = useState(false);

    const handleClick = () => {
        const { cert, macaroon, socket } = getAuthLnd(url);
        const base64Cert = getBase64CertfromDerFormat(cert) || '';

        handleSet &&
            handleSet({
                name,
                host: socket,
                admin: macaroon,
                cert: base64Cert,
            });
    };

    const canConnect = url !== '' && !!available && checked;

    return (
        <>
            <Line>
                <StyledTitle>Name:</StyledTitle>
                <Input onChange={e => setName(e.target.value)} />
            </Line>
            <Line>
                <StyledTitle>LND Connect Url:</StyledTitle>
                <Input onChange={e => setUrl(e.target.value)} />
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
