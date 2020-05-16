import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAccountState } from 'src/context/AccountContext';
import { DarkSubTitle, SingleLine } from '../../../components/generic/Styled';
import { saveToPc } from '../../../utils/helpers';
import { getErrorContent } from '../../../utils/error';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { useGetBackupsLazyQuery } from '../../../generated/graphql';

export const DownloadBackups = () => {
  const { name, auth } = useAccountState();

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
