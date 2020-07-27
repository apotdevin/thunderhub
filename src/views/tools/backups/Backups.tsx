import React, { useState, useEffect } from 'react';
import {
  CardWithTitle,
  CardTitle,
  SubTitle,
  Card,
  Separation,
  Sub4Title,
  ResponsiveLine,
  DarkSubTitle,
} from '../../../components/generic/Styled';
import { getDateDif, getFormatDate } from '../../../components/generic/helpers';
import { DownloadBackups } from './DownloadBackups';
import { VerifyBackups } from './VerifyBackups';
import { RecoverFunds } from './RecoverFunds';

export const BackupsView = () => {
  const [lastDate, setLastDate] = useState('');

  // TODO: Get correct account
  const account = { id: 'testing' };

  useEffect(() => {
    if (account) {
      const date = localStorage.getItem(`lastBackup-${account.id}`);
      date && setLastDate(date);
    }
  }, [account]);

  const getDate = () => {
    if (lastDate) {
      return `${getDateDif(lastDate)} ago (${getFormatDate(lastDate)})`;
    }
    return 'Has not been backed up!';
  };

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Backups</SubTitle>
      </CardTitle>
      <Card>
        <ResponsiveLine>
          <DarkSubTitle>Last Backup Date:</DarkSubTitle>
          <Sub4Title>{getDate()}</Sub4Title>
        </ResponsiveLine>
        <Separation />
        <DownloadBackups />
        <VerifyBackups />
        <RecoverFunds />
      </Card>
    </CardWithTitle>
  );
};
