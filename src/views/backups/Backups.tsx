import React from 'react';
import {
    CardWithTitle,
    CardTitle,
    SubTitle,
    Card,
    SingleLine,
    Separation,
    Sub4Title,
} from '../../components/generic/Styled';
import { DownloadBackups } from './DownloadBackups';
import { VerifyBackups } from './VerifyBackups';
import { RecoverFunds } from './RecoverFunds';
import { AdminSwitch } from '../../components/adminSwitch/AdminSwitch';
import styled from 'styled-components';

const backupColor = '#ffffff';

export const FixedWidth = styled.div`
    width: 200px;
`;

export const NoWrap = styled.div`
    margin-right: 16px;
    white-space: nowrap;
`;

export const BackupsView = () => {
    const lastDate = localStorage.getItem('lastBackup');

    const getDate = () => {
        if (lastDate) {
            return lastDate;
        }
        return 'Has not been backed up!';
    };

    return (
        <CardWithTitle>
            <CardTitle>
                <SubTitle>General Backup</SubTitle>
            </CardTitle>
            <Card>
                <SingleLine>
                    <SubTitle>Last Backup Date:</SubTitle>
                    <Sub4Title>{getDate()}</Sub4Title>
                </SingleLine>
                <Separation />
                <DownloadBackups color={backupColor} />
                <VerifyBackups color={backupColor} />
                <AdminSwitch>
                    <RecoverFunds color={backupColor} />
                </AdminSwitch>
            </Card>
        </CardWithTitle>
    );
};
