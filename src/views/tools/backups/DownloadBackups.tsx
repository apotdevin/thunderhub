import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGetBackupsLazyQuery } from 'src/graphql/queries/__generated__/getBackups.generated';
import { useAccount } from 'src/hooks/UseAccount';
import { DarkSubTitle, SingleLine } from '../../../components/generic/Styled';
import { saveToPc } from '../../../utils/helpers';
import { getErrorContent } from '../../../utils/error';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';

export const DownloadBackups = () => {
  const [getBackups, { data, loading }] = useGetBackupsLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const account = useAccount();

  useEffect(() => {
    if (account && !loading && data && data.getBackups) {
      saveToPc(data.getBackups, `ChannelBackup-${account.name}-${account.id}`);
      localStorage.setItem(`lastBackup-${account.id}`, new Date().toString());
      toast.success('Downloaded');
    }
  }, [data, loading, account]);

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
