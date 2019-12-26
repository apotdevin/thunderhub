import React from 'react';
import {
    CardWithTitle,
    CardTitle,
    SubTitle,
    Card,
    SingleLine,
    DarkSubTitle,
} from '../../components/generic/Styled';
import { DownloadBackups } from './DownloadBackups';
import { VerifyBackups } from './VerifyBackups';

const backupColor = '#ffffff';

export const BackupsView = () => {
    return (
        <CardWithTitle>
            <CardTitle>
                <SubTitle>General Backup</SubTitle>
            </CardTitle>
            <Card>
                <DownloadBackups color={backupColor} />
                <VerifyBackups color={backupColor} />
                <SingleLine>
                    <DarkSubTitle>
                        Restore All Channels from Backup
                    </DarkSubTitle>
                </SingleLine>
            </Card>
        </CardWithTitle>
    );
};
