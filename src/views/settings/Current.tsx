import React from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
    Sub4Title,
} from '../../components/generic/Styled';
import styled from 'styled-components';
import { chartLinkColor, colorButtonBackground } from '../../styles/Themes';
import { useAccount } from '../../context/AccountContext';

const CurrentField = styled.div`
    color: ${chartLinkColor};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 10px 0;
    font-size: 14px;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: ${colorButtonBackground};
`;

export const CurrentSettings = () => {
    const { name, host, admin, read, cert } = useAccount();

    const renderField = (title: string, field: string | null) => {
        if (!field) return null;

        return (
            <>
                <Sub4Title>{title}</Sub4Title>
                <CurrentField>{field}</CurrentField>
            </>
        );
    };

    return (
        <CardWithTitle>
            <SubTitle>Current Account:</SubTitle>
            <Card>
                {renderField('Name:', name)}
                {renderField('Host:', host)}
                {renderField('AES Encrypted Admin Macaroon:', admin)}
                {renderField('Read-only Macaroon:', read)}
                {renderField('Certificate:', cert)}
            </Card>
        </CardWithTitle>
    );
};
