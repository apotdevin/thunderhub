import React, { useEffect } from 'react';
import { DarkSubTitle, SingleLine } from '../../components/generic/Styled';
import { saveToPc } from '../../helpers/Helpers';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_BACKUPS } from '../../graphql/query';
import { useAccount } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';

export const DownloadBackups = ({ color }: { color: string }) => {
    const { name, host, read, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(host, read !== '' ? read : sessionAdmin, cert);

    const [getBackups, { data, loading }] = useLazyQuery(GET_BACKUPS, {
        variables: { auth },
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        if (!loading && data && data.getBackups) {
            saveToPc(data.getBackups, `Backup-${name}`);
            localStorage.setItem('lastBackup', new Date().toString());
            toast.success('Downloaded');
        }
    }, [data, loading, name]);

    return (
        <SingleLine>
            <DarkSubTitle>Backup All Channels</DarkSubTitle>

            <ColorButton
                withMargin={'4px 0'}
                disabled={loading}
                onClick={() => getBackups()}
            >
                {loading ? (
                    <ScaleLoader height={8} width={2} color={color} />
                ) : (
                    'Download'
                )}
            </ColorButton>
        </SingleLine>
    );
};
