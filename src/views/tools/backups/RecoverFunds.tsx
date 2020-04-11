import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { RECOVER_FUNDS } from '../../../graphql/query';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { SingleLine, DarkSubTitle } from '../../../components/generic/Styled';
import { XSvg } from '../../../components/generic/Icons';
import { SecureButton } from '../../../components/buttons/secureButton/SecureButton';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { Input } from '../../../components/input/Input';
import { NoWrap } from '../Tools.styled';

export const RecoverFunds = () => {
  const [backupString, setBackupString] = useState<string>('');
  const [isPasting, setIsPasting] = useState<boolean>(false);

  const [recoverFunds, { data, loading }] = useLazyQuery(RECOVER_FUNDS, {
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
      <SecureButton
        fullWidth={true}
        withMargin={'8px 0 4px'}
        callback={recoverFunds}
        variables={{ backup: backupString }}
        disabled={backupString === ''}
        loading={loading}
      >
        Recover
      </SecureButton>
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
          {isPasting ? <XSvg /> : 'Recover'}
        </ColorButton>
      </SingleLine>
      {isPasting && renderInput()}
    </>
  );
};
