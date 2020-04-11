import React, { useEffect } from 'react';
import { DarkSubTitle, SingleLine } from '../../../components/generic/Styled';
import { saveToPc } from '../../../utils/Helpers';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_BACKUPS } from '../../../graphql/query';
import { useAccount } from '../../../context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';

export const DownloadBackups = () => {
  const { name, host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

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
        loading={loading}
      >
        Download
      </ColorButton>
    </SingleLine>
  );
};
