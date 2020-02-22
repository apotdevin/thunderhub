import React from 'react';
import { GET_CAN_ADMIN } from 'graphql/query';
import { useQuery } from '@apollo/react-hooks';
import { getAuthString } from 'utils/auth';
import { SingleLine, Sub4Title } from 'components/generic/Styled';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { themeColors } from 'styles/Themes';
import { XSvg, Check } from 'components/generic/Icons';

type AdminProps = {
    host: string;
    admin: string;
    cert: string;
    setChecked: (state: boolean) => void;
};

export const AdminCheck = ({ host, admin, cert, setChecked }: AdminProps) => {
    const { data, loading } = useQuery(GET_CAN_ADMIN, {
        skip: !admin,
        variables: { auth: getAuthString(host, admin, cert) },
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
        } else if (data?.adminCheck) {
            return <Check />;
        }
        return <XSvg />;
    };

    return (
        <SingleLine>
            <Sub4Title>Admin Macaroon</Sub4Title>
            {content()}
        </SingleLine>
    );
};
