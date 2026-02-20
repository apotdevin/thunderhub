import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useGetBackupsLazyQuery } from '../../../graphql/queries/__generated__/getBackups.generated';
import { format } from 'date-fns';
import { useNodeInfo } from '../../../hooks/UseNodeInfo';
import { DarkSubTitle, SingleLine } from '../../../components/generic/Styled';
import { saveToPc } from '../../../utils/helpers';
import { getErrorContent } from '../../../utils/error';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';

export const DownloadBackups = () => {
  const [getBackups, { data, loading }] = useGetBackupsLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const { publicKey } = useNodeInfo();

  useEffect(() => {
    if (loading || !data?.getBackups) return;

    const date = format(new Date(), 'ddMMyyyyhhmmss');
    saveToPc(data.getBackups, `ChannelBackup-${publicKey}-${date}`);
    localStorage.setItem(`lastBackup-${publicKey}`, new Date().toString());
    toast.success('Downloaded');
  }, [data, loading, publicKey]);

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
