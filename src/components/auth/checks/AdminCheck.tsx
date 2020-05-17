import React from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { X, Check } from 'react-feather';
import { getAuthObj } from 'src/utils/auth';
import { SingleLine, Sub4Title } from '../../generic/Styled';
import { themeColors } from '../../../styles/Themes';
import { useGetCanAdminQuery } from '../../../generated/graphql';

type AdminProps = {
  host: string;
  admin: string;
  cert?: string;
  setChecked: (state: boolean) => void;
};

export const AdminCheck = ({ host, admin, cert, setChecked }: AdminProps) => {
  const { data, loading } = useGetCanAdminQuery({
    fetchPolicy: 'network-only',
    skip: !admin,
    variables: { auth: getAuthObj(host, null, admin, cert) },
    onError: () => {
      setChecked(false);
    },
    onCompleted: () => {
      setChecked(true);
    },
  });

  const content = () => {
    if (loading) {
      return <ScaleLoader height={20} color={themeColors.blue3} />;
    }
    if (data?.adminCheck) {
      return <Check size={18} />;
    }
    return <X size={18} />;
  };

  return (
    <SingleLine>
      <Sub4Title>Admin Macaroon</Sub4Title>
      {content()}
    </SingleLine>
  );
};
