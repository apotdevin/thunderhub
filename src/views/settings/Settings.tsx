import React from 'react';
import { SingleLine, SimpleButton } from '../../components/generic/Styled';
import styled from 'styled-components';
import { InterfaceSettings } from './Interface';
import { textColor } from '../../styles/Themes';
import { AccountSettings } from './Account';
import { DangerView } from './Danger';
import { CurrentSettings } from './Current';

export const ButtonRow = styled.div`
    width: auto;
    display: flex;
`;

export const SettingsLine = styled(SingleLine)`
    margin: 10px 0;
`;

export const SettingsButton = styled(SimpleButton)`
    padding: 10px;

    &:hover {
        border: 1px solid ${textColor};
    }
`;

export const SettingsView = () => {
    return (
        <>
            <InterfaceSettings />
            <CurrentSettings />
            <AccountSettings />
            <DangerView />
        </>
    );
};
