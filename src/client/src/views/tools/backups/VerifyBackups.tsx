import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, ChevronRight, Loader2 } from 'lucide-react';
import { useVerifyBackupsLazyQuery } from '../../../graphql/queries/__generated__/verifyBackups.generated';
import { getErrorContent } from '../../../utils/error';
import {
  SingleLine,
  DarkSubTitle,
  SubCard,
} from '../../../components/generic/Styled';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const VerifyBackups = () => {
  const [backupString, setBackupString] = useState<string>('');
  const [isPasting, setIsPasting] = useState<boolean>(false);

  const [verifyBackup, { data, loading }] = useVerifyBackupsLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.verifyBackups) {
      toast.success('Valid Backup String');
    }
    if (!loading && data && !data.verifyBackups) {
      toast.error('Invalid Backup String');
    }
  }, [data, loading]);

  const renderInput = () => (
    <SubCard>
      <SingleLine>
        <div className="mr-4 whitespace-nowrap">
          <DarkSubTitle>Backup String:</DarkSubTitle>
        </div>
        <Input
          placeholder="Content from file"
          style={{ margin: '8px 0 0' }}
          onChange={e => setBackupString(e.target.value)}
        />
      </SingleLine>
      <Button
        variant="outline"
        className="w-full"
        style={{ margin: '8px 0 4px' }}
        disabled={backupString === '' || loading}
        onClick={() =>
          verifyBackup({
            variables: { backup: backupString },
          })
        }
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Verify</>}
      </Button>
    </SubCard>
  );

  return (
    <>
      <SingleLine>
        <DarkSubTitle>Verify Channels Backup</DarkSubTitle>
        <Button
          variant="outline"
          style={{ margin: '4px 0' }}
          disabled={loading}
          onClick={() => setIsPasting(prev => !prev)}
        >
          {isPasting ? (
            <X size={18} />
          ) : (
            <>Verify {!isPasting && <ChevronRight size={18} />}</>
          )}
        </Button>
      </SingleLine>
      {isPasting && renderInput()}
    </>
  );
};
