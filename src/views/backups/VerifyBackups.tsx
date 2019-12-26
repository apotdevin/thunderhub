import React, { useState, useEffect } from 'react';
import { useAccount } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { useLazyQuery } from '@apollo/react-hooks';
import { VERIFY_BACKUPS } from '../../graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import {
    ColorButton,
    SingleLine,
    DarkSubTitle,
    Input,
    SubCard,
} from '../../components/generic/Styled';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { XSvg } from '../../components/generic/Icons';
import styled from 'styled-components';

const RightButton = styled(ColorButton)`
    margin: 0 0 0 auto;
`;

export const VerifyBackups = ({ color }: { color: string }) => {
    const [backupString, setBackupString] = useState<string>('');
    const [isPasting, setIsPasting] = useState<boolean>(false);

    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

    const [verifyBackup, { data, loading }] = useLazyQuery(VERIFY_BACKUPS, {
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        if (!loading && data && data.verifyBackups) {
            toast.success(`Valid Backup String`);
        }
        if (!loading && data && !data.verifyBackups) {
            toast.error(`Invalid Backup String`);
        }
    }, [data, loading]);

    const renderInput = () => (
        <SubCard>
            <SingleLine>
                <DarkSubTitle>Backup String: </DarkSubTitle>
                <Input onChange={e => setBackupString(e.target.value)} />
            </SingleLine>
            <RightButton
                disabled={backupString === ''}
                color={color}
                onClick={() =>
                    verifyBackup({ variables: { auth, backup: backupString } })
                }
            >
                {loading ? (
                    <ScaleLoader height={8} width={2} color={color} />
                ) : (
                    'Verify'
                )}
            </RightButton>
        </SubCard>
    );

    return (
        <>
            <SingleLine>
                <DarkSubTitle>Verify Channels Backup</DarkSubTitle>
                <ColorButton
                    disabled={loading}
                    color={color}
                    onClick={() => setIsPasting(prev => !prev)}
                >
                    {isPasting ? <XSvg /> : 'Verify'}
                </ColorButton>
            </SingleLine>
            {isPasting && renderInput()}
        </>
    );
};
