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

const backupColor = '#ffffff';

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
                <RecoverFunds color={backupColor} />
            </Card>
        </CardWithTitle>
    );
};
