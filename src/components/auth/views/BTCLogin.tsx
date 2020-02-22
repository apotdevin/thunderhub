import React, { useState } from 'react';
import { getConfigLnd } from '../../../utils/auth';
import { toast } from 'react-toastify';
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

export const BTCLoginForm = ({ available, handleSet }: AuthProps) => {
    const [name, setName] = useState('');
    const [json, setJson] = useState('');
    const [checked, setChecked] = useState(false);

    const handleClick = () => {
        try {
            JSON.parse(json);
            const { cert, admin, viewOnly, host } = getConfigLnd(json);
            handleSet && handleSet({ name, host, admin, viewOnly, cert });
        } catch (error) {
            toast.error('Invalid JSON Object');
        }
    };

    const canConnect = json !== '' && !!available && checked;
    return (
        <>
            <Line>
                <StyledTitle>Name:</StyledTitle>
                <Input onChange={e => setName(e.target.value)} />
            </Line>
            <Line>
                <StyledTitle>BTCPayServer Connect JSON:</StyledTitle>
                <Input onChange={e => setJson(e.target.value)} />
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
