import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X } from 'react-feather';
import { getErrorContent } from '../../../utils/error';
import {
  SingleLine,
  DarkSubTitle,
  SubCard,
} from '../../../components/generic/Styled';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { Input } from '../../../components/input';
import { NoWrap } from '../Tools.styled';
import { useVerifyBackupLazyQuery } from '../../../graphql/queries/__generated__/verifyBackup.generated';

export const VerifyBackup = () => {
  const [backupString, setBackupString] = useState<string>('');
  const [isPasting, setIsPasting] = useState<boolean>(false);

  const [verifyBackup, { data, loading }] = useVerifyBackupLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.verifyBackup) {
      toast.success('Valid Backup String');
    }
    if (!loading && data && !data.verifyBackup) {
      toast.error('Invalid Backup String');
    }
  }, [data, loading]);

  const renderInput = () => (
    <SubCard>
      <SingleLine>
        <NoWrap>
          <DarkSubTitle>Backup Hex String:</DarkSubTitle>
        </NoWrap>
        <Input
          placeholder="Hex string for single channel"
          withMargin={'8px 0 0'}
          onChange={e => setBackupString(e.target.value)}
        />
      </SingleLine>
      <ColorButton
        fullWidth={true}
        withMargin={'8px 0 4px'}
        disabled={backupString === ''}
        loading={loading}
        onClick={() =>
          verifyBackup({
            variables: { backup: backupString },
          })
        }
      >
        Verify
      </ColorButton>
    </SubCard>
  );

  return (
    <>
      <SingleLine>
        <DarkSubTitle>Verify Single Channel Backup</DarkSubTitle>
        <ColorButton
          withMargin={'4px 0'}
          disabled={loading}
          arrow={!isPasting}
          onClick={() => setIsPasting(prev => !prev)}
        >
          {isPasting ? <X size={18} /> : 'Verify'}
        </ColorButton>
      </SingleLine>
      {isPasting && renderInput()}
    </>
  );
};
