import React, { useState, useEffect } from 'react';
import { SingleLine, Sub4Title, Separation } from '../../generic/Styled';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { themeColors } from '../../../styles/Themes';
import { Check, X } from 'react-feather';
import { ColorButton } from '../../buttons/colorButton/ColorButton';
import { AdminCheck } from './AdminCheck';
import { Text } from '../../typography/Styled';
import { useGetCanConnectQuery } from '../../../generated/graphql';

type ViewProps = {
  host: string;
  admin?: string;
  viewOnly?: string;
  cert?: string;
  adminChecked: boolean;
  callback: () => void;
  setAdminChecked: (state: boolean) => void;
  handleConnect: () => void;
  setName: (name: string) => void;
};

export const ViewCheck = ({
  host,
  admin,
  viewOnly,
  cert,
  adminChecked,
  setAdminChecked,
  handleConnect,
  callback,
  setName,
}: ViewProps) => {
  const [confirmed, setConfirmed] = useState(false);

  const { data, loading } = useGetCanConnectQuery({
    fetchPolicy: 'network-only',
    variables: { auth: { host, macaroon: viewOnly ?? admin ?? '', cert } },
    onCompleted: () => setConfirmed(true),
    onError: () => setConfirmed(false),
  });

  useEffect(() => {
    if (!loading && data && data.getNodeInfo) {
      setName(data.getNodeInfo.alias);
    }
  }, [loading, data, setName]);

  const content = () => {
    if (loading) {
      return <ScaleLoader height={20} color={themeColors.blue3} />;
    }
    if (data?.getNodeInfo.alias) {
      return <Check size={18} />;
    }
    return <X size={18} />;
  };

  const renderInfo = () => {
    if (!loading && data && data.getNodeInfo) {
      return (
        <>
          <SingleLine>
            <Sub4Title>Alias</Sub4Title>
            <Sub4Title>{data.getNodeInfo.alias}</Sub4Title>
          </SingleLine>
          <SingleLine>
            <Sub4Title>Synced To Chain</Sub4Title>
            <Sub4Title>
              {data.getNodeInfo.is_synced_to_chain ? 'Yes' : 'No'}
            </Sub4Title>
          </SingleLine>
          <SingleLine>
            <Sub4Title>Version</Sub4Title>
            <Sub4Title>{data.getNodeInfo.version.split(' ')[0]}</Sub4Title>
          </SingleLine>
          <SingleLine>
            <Sub4Title>Active Channels</Sub4Title>
            <Sub4Title>{data.getNodeInfo.active_channels_count}</Sub4Title>
          </SingleLine>
          <SingleLine>
            <Sub4Title>Pending Channels</Sub4Title>
            <Sub4Title>{data.getNodeInfo.pending_channels_count}</Sub4Title>
          </SingleLine>
          <SingleLine>
            <Sub4Title>Closed Channels</Sub4Title>
            <Sub4Title>{data.getNodeInfo.closed_channels_count}</Sub4Title>
          </SingleLine>
          <Separation />
        </>
      );
    }
    return null;
  };

  const renderTitle = () => {
    if (!confirmed) {
      return 'Go Back';
    }
    if (adminChecked && !viewOnly && admin) {
      return 'Connect (Admin-Only)';
    }
    if (!adminChecked && viewOnly) {
      return 'Connect (View-Only)';
    }
    if (!adminChecked && admin) {
      return 'Connect (View-Only)';
    }
    return 'Connect';
  };

  const renderText = () => (
    <Text>
      Failed to connect to node. Please verify the information provided.
    </Text>
  );

  return (
    <>
      {renderInfo()}
      {!confirmed && !loading && renderText()}
      <SingleLine>
        <Sub4Title>{viewOnly ? 'View-Only Macaroon' : 'Connected'}</Sub4Title>
        {content()}
      </SingleLine>
      {admin && confirmed && (
        <AdminCheck
          host={host}
          admin={admin}
          cert={cert}
          setChecked={setAdminChecked}
        />
      )}
      <ColorButton
        fullWidth={true}
        withMargin={'16px 0 0'}
        disabled={loading}
        loading={loading}
        arrow={confirmed}
        onClick={() => {
          if (confirmed) {
            handleConnect();
          } else {
            callback();
          }
        }}
      >
        {renderTitle()}
      </ColorButton>
    </>
  );
};
