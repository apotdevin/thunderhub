import React from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { X, Check } from 'react-feather';
import { getAuthObj } from 'src/utils/auth';
import { useGetCanAdminQuery } from 'src/graphql/queries/__generated__/adminCheck.generated';
import { SingleLine, Sub4Title } from '../../generic/Styled';
import { themeColors } from '../../../styles/Themes';

type AdminProps = {
  host: string;
  admin: string;
  cert?: string;
  setChecked: (state: boolean) => void;
};

export const AdminCheck: React.FC<AdminProps> = ({
  host,
  admin,
  cert,
  setChecked,
}) => {
  const { data, loading } = useGetCanAdminQuery({
    fetchPolicy: 'network-only',
    skip: !admin,
    variables: { auth: getAuthObj(host, undefined, admin, cert) },
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
