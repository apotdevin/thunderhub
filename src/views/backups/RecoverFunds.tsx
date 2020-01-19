import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { RECOVER_FUNDS } from '../../graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import {
    SingleLine,
    DarkSubTitle,
    Input,
    SubCard,
    RightAlign,
} from '../../components/generic/Styled';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { XSvg, ChevronRight } from '../../components/generic/Icons';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';

export const RecoverFunds = ({ color }: { color: string }) => {
    const [backupString, setBackupString] = useState<string>('');
    const [isPasting, setIsPasting] = useState<boolean>(false);

    const [recoverFunds, { data, loading }] = useLazyQuery(RECOVER_FUNDS, {
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        if (!loading && data && data.recoverFunds) {
            toast.success(`Recovery Succesfull`);
        }
    }, [data, loading]);

    const renderInput = () => (
        <SubCard>
            <SingleLine>
                <DarkSubTitle>Backup String: </DarkSubTitle>
                <Input onChange={e => setBackupString(e.target.value)} />
            </SingleLine>
            <RightAlign>
                <SecureButton
                    callback={recoverFunds}
                    variables={{ backup: backupString }}
                    color={color}
                    disabled={backupString === ''}
                >
                    {loading ? (
                        <ScaleLoader height={8} width={2} color={color} />
                    ) : (
                        <>
                            Recover
                            <ChevronRight />
                        </>
                    )}
                </SecureButton>
            </RightAlign>
        </SubCard>
    );

    return (
        <>
            <SingleLine>
                <DarkSubTitle>Recover Funds from Channels</DarkSubTitle>
                <ColorButton
                    withMargin={'4px 0'}
                    disabled={loading}
                    onClick={() => setIsPasting(prev => !prev)}
                >
                    {isPasting ? <XSvg /> : 'Recover'}
                </ColorButton>
            </SingleLine>
            {isPasting && renderInput()}
        </>
    );
};
