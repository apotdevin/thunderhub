import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_CAN_CONNECT } from 'graphql/query';
import { getAuthString } from 'utils/auth';
import { SingleLine, Sub4Title, Separation } from 'components/generic/Styled';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { themeColors } from 'styles/Themes';
import { Check, XSvg } from 'components/generic/Icons';
import { ColorButton } from 'components/buttons/colorButton/ColorButton';
import { AdminCheck } from './AdminCheck';
import { Text } from 'views/other/OtherViews.styled';

type ViewProps = {
    host: string;
    admin: string;
    viewOnly: string;
    cert: string;
    adminChecked: boolean;
    callback: () => void;
    setAdminChecked: (state: boolean) => void;
    handleConnect: () => void;
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
}: ViewProps) => {
    const [confirmed, setConfirmed] = useState(false);

    const { data, loading } = useQuery(GET_CAN_CONNECT, {
        variables: { auth: getAuthString(host, viewOnly ?? admin, cert) },
        onCompleted: () => setConfirmed(true),
        onError: () => setConfirmed(false),
    });

    const content = () => {
        if (loading) {
            return <ScaleLoader height={20} color={themeColors.blue3} />;
        } else if (data?.getNodeInfo.alias && viewOnly) {
            return <Check />;
        }
        return <XSvg />;
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
                        <Sub4Title>
                            {data.getNodeInfo.version.split(' ')[0]}
                        </Sub4Title>
                    </SingleLine>
                    <SingleLine>
                        <Sub4Title>Active Channels</Sub4Title>
                        <Sub4Title>
                            {data.getNodeInfo.active_channels_count}
                        </Sub4Title>
                    </SingleLine>
                    <SingleLine>
                        <Sub4Title>Pending Channels</Sub4Title>
                        <Sub4Title>
                            {data.getNodeInfo.pending_channels_count}
                        </Sub4Title>
                    </SingleLine>
                    <SingleLine>
                        <Sub4Title>Closed Channels</Sub4Title>
                        <Sub4Title>
                            {data.getNodeInfo.closed_channels_count}
                        </Sub4Title>
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
        } else if (adminChecked && !viewOnly && admin) {
            return 'Connect (Admin-Only)';
        } else if (!adminChecked && viewOnly) {
            return 'Connect (View-Only)';
        } else {
            return 'Connect';
        }
    };

    const renderButton = () => (
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
    );

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
                <Sub4Title>View-Only Macaroon</Sub4Title>
                {content()}
            </SingleLine>
            <AdminCheck
                host={host}
                admin={admin}
                cert={cert}
                setChecked={setAdminChecked}
            />
            {renderButton()}
        </>
    );
};
