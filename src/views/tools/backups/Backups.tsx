import React, { useState, useEffect } from 'react';
import { useAccountState } from 'src/context/AccountContext';
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
import { AdminSwitch } from '../../../components/adminSwitch/AdminSwitch';
import { getDateDif, getFormatDate } from '../../../components/generic/helpers';
import { DownloadBackups } from './DownloadBackups';
import { VerifyBackups } from './VerifyBackups';
import { RecoverFunds } from './RecoverFunds';

export const BackupsView = () => {
  const [lastDate, setLastDate] = useState('');
  const { account } = useAccountState();

  useEffect(() => {
    const date = localStorage.getItem(`lastBackup-${account.id}`);
    setLastDate(date);
  }, []);

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
        <AdminSwitch>
          <RecoverFunds />
        </AdminSwitch>
      </Card>
    </CardWithTitle>
  );
};
