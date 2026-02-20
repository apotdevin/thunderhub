import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useRecoverFundsLazyQuery } from '../../../graphql/queries/__generated__/recoverFunds.generated';
import { getErrorContent } from '../../../utils/error';
import { SingleLine, DarkSubTitle } from '../../../components/generic/Styled';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { Input } from '../../../components/input';
import { NoWrap } from '../Tools.styled';

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
        <NoWrap>
          <DarkSubTitle>Backup String: </DarkSubTitle>
        </NoWrap>
        <Input onChange={e => setBackupString(e.target.value)} />
      </SingleLine>
      <ColorButton
        fullWidth={true}
        withMargin={'8px 0 4px'}
        onClick={() => recoverFunds({ variables: { backup: backupString } })}
        disabled={backupString === ''}
        loading={loading}
      >
        Recover
      </ColorButton>
    </>
  );

  return (
    <>
      <SingleLine>
        <DarkSubTitle>Recover Funds from Channels</DarkSubTitle>
        <ColorButton
          withMargin={'4px 0'}
          disabled={loading}
          arrow={!isPasting}
          onClick={() => setIsPasting(prev => !prev)}
        >
          {isPasting ? <X size={18} /> : 'Recover'}
        </ColorButton>
      </SingleLine>
      {isPasting && renderInput()}
    </>
  );
};
