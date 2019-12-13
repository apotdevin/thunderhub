import React from 'react';
import {
    CardWithTitle,
    SubTitle,
    Card,
    Sub4Title,
} from '../../components/generic/Styled';
import styled from 'styled-components';
import { unSelectedNavButton, chartLinkColor } from '../../styles/Themes';

const CurrentField = styled.div`
    color: ${chartLinkColor};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 1px solid ${unSelectedNavButton};
    margin: 10px 0;
    font-size: 14px;
    padding: 5px 10px;
    border-radius: 5px;
`;

export const CurrentSettings = () => {
    const currentAuth = localStorage.getItem('account') || 'auth1';
    const currentName = localStorage.getItem(`${currentAuth}-name`);
    const currentAdmin = localStorage.getItem(`${currentAuth}-admin`);
    const currentRead = localStorage.getItem(`${currentAuth}-read`);
    const currentCert = localStorage.getItem(`${currentAuth}-cert`);
    const currentHost = localStorage.getItem(`${currentAuth}-host`);

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
                {renderField('Name:', currentName)}
                {renderField('AES Encrypted Admin Macaroon:', currentAdmin)}
                {renderField('Read-only Macaroon:', currentRead)}
                {renderField('Certificate:', currentCert)}
                {renderField('Host:', currentHost)}
            </Card>
        </CardWithTitle>
    );
};
