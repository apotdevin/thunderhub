import React, { useEffect } from 'react';
import { DarkSubTitle, SingleLine } from '../../../components/generic/Styled';
import { saveToPc } from '../../../utils/hhelpers';
import { useAccount } from '../../../context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { useGetBackupsLazyQuery } from '../../../generated/graphql';

export const DownloadBackups = () => {
  const { name, auth } = useAccount();

  const [getBackups, { data, loading }] = useGetBackupsLazyQuery({
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
