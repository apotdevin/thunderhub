import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, ChevronRight, Loader2 } from 'lucide-react';
import { useRecoverFundsLazyQuery } from '../../../graphql/queries/__generated__/recoverFunds.generated';
import { getErrorContent } from '../../../utils/error';
import { SingleLine, DarkSubTitle } from '../../../components/generic/Styled';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const RecoverFunds = () => {
  const [backupString, setBackupString] = useState<string>('');
  const [isPasting, setIsPasting] = useState<boolean>(false);

  const [recoverFunds, { data, loading }] = useRecoverFundsLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.recoverFunds) {
      toast.success('Recovery Succesfull');
    }
  }, [data, loading]);

  const renderInput = () => (
    <>
      <SingleLine>
        <div className="mr-4 whitespace-nowrap">
          <DarkSubTitle>Backup String: </DarkSubTitle>
        </div>
        <Input onChange={e => setBackupString(e.target.value)} />
      </SingleLine>
      <Button
        variant="outline"
        className="w-full"
        style={{ margin: '8px 0 4px' }}
        onClick={() => recoverFunds({ variables: { backup: backupString } })}
        disabled={backupString === '' || loading}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>Recover</>
        )}
      </Button>
    </>
  );

  return (
    <>
      <SingleLine>
        <DarkSubTitle>Recover Funds from Channels</DarkSubTitle>
        <Button
          variant="outline"
          style={{ margin: '4px 0' }}
          disabled={loading}
          onClick={() => setIsPasting(prev => !prev)}
        >
          {isPasting ? (
            <X size={18} />
          ) : (
            <>Recover {!isPasting && <ChevronRight size={18} />}</>
          )}
        </Button>
      </SingleLine>
      {isPasting && renderInput()}
    </>
  );
};
