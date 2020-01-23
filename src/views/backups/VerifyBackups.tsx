import React, { useState, useEffect } from 'react';
import { useAccount } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { useLazyQuery } from '@apollo/react-hooks';
import { VERIFY_BACKUPS } from '../../graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import {
    SingleLine,
    DarkSubTitle,
    Input,
    RightAlign,
    Separation,
} from '../../components/generic/Styled';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { XSvg } from '../../components/generic/Icons';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { NoWrap } from './Backups';

export const VerifyBackups = ({ color }: { color: string }) => {
    const [backupString, setBackupString] = useState<string>('');
    const [isPasting, setIsPasting] = useState<boolean>(false);

    const { host, read, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(host, read !== '' ? read : sessionAdmin, cert);

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
        <>
            <SingleLine>
                <NoWrap>
                    <DarkSubTitle>Backup String: </DarkSubTitle>
                </NoWrap>
                <Input onChange={e => setBackupString(e.target.value)} />
            </SingleLine>
            <RightAlign>
                <ColorButton
                    disabled={backupString === ''}
                    onClick={() =>
                        verifyBackup({
                            variables: { auth, backup: backupString },
                        })
                    }
                >
                    {loading ? (
                        <ScaleLoader height={8} width={2} color={color} />
                    ) : (
                        'Verify'
                    )}
                </ColorButton>
            </RightAlign>
            <Separation />
        </>
    );

    return (
        <>
            <SingleLine>
                <DarkSubTitle>Verify Channels Backup</DarkSubTitle>
                <ColorButton
                    withMargin={'4px 0'}
                    disabled={loading}
                    onClick={() => setIsPasting(prev => !prev)}
                >
                    {isPasting ? <XSvg /> : 'Verify'}
                </ColorButton>
            </SingleLine>
            {isPasting && renderInput()}
        </>
    );
};
