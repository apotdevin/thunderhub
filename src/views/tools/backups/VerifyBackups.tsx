import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X } from 'react-feather';
import { useAccount } from '../../../context/AccountContext';
import { getErrorContent } from '../../../utils/error';
import {
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { Input } from '../../../components/input/Input';
import { NoWrap } from '../Tools.styled';
import { useVerifyBackupsLazyQuery } from '../../../generated/graphql';

export const VerifyBackups = () => {
  const [backupString, setBackupString] = useState<string>('');
  const [isPasting, setIsPasting] = useState<boolean>(false);

  const { auth } = useAccount();

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
    <>
      <SingleLine>
        <NoWrap>
          <DarkSubTitle>Backup String: </DarkSubTitle>
        </NoWrap>
        <Input
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
            variables: { auth, backup: backupString },
          })
        }
      >
        Verify
      </ColorButton>
      <Separation />
    </>
  );

  return (
    <>
      <SingleLine>
        <DarkSubTitle>Verify Channels Backup</DarkSubTitle>
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
