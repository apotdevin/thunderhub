import React, { useState } from 'react';
import { getConfigLnd } from '../../../utils/auth';
import { toast } from 'react-toastify';
import { Input } from 'components/input/Input';
import { Line, StyledTitle } from '../Auth.styled';
import { RiskCheckboxAndConfirm } from './Checkboxes';

interface AuthProps {
    handleSet: ({
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

export const BTCLoginForm = ({ handleSet }: AuthProps) => {
    const [name, setName] = useState('');
    const [json, setJson] = useState('');
    const [checked, setChecked] = useState(false);

    const handleClick = () => {
        try {
            JSON.parse(json);
            const { cert, admin, viewOnly, host } = getConfigLnd(json);
            handleSet({ name, host, admin, viewOnly, cert });
        } catch (error) {
            toast.error('Invalid JSON');
        }
    };

    const canConnect = json !== '' && checked;
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
