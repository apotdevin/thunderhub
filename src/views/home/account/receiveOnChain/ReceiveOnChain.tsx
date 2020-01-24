import React, { useState, useEffect } from 'react';
import {
    ColorButton,
    NoWrapTitle,
    DarkSubTitle,
    Separation,
} from '../../../../components/generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ADDRESS } from '../../../../graphql/mutation';
import { Circle } from '../../../../components/generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { textColorMap } from '../../../../styles/Themes';
import { useSettings } from '../../../../context/SettingsContext';
import { useSize } from '../../../../hooks/UseSize';

const SingleLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const RadioText = styled.div`
    margin-left: 10px;
`;

const ButtonRow = styled.div`
    width: auto;
    display: flex;
`;

const TitleWithSpacing = styled(NoWrapTitle)`
    margin-right: 10px;
`;

const ResponsiveLine = styled(SingleLine)`
    width: 100%;

    @media (max-width: 578px) {
        flex-direction: column;
    }
`;

export const ReceiveOnChainCard = ({ color }: { color: string }) => {
    const { width } = useSize();
    const { theme } = useSettings();

    const [nested, setNested] = useState(false);
    const [received, setReceived] = useState(false);

    const [createAddress, { data, loading }] = useMutation(CREATE_ADDRESS, {
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        data && data.createAddress && setReceived(true);
    }, [data]);

    return (
        <>
            <ResponsiveLine>
                <ButtonRow>
                    <TitleWithSpacing>Type of Address:</TitleWithSpacing>
                    <ResponsiveLine>
                        <ColorButton
                            color={color}
                            onClick={() => {
                                setNested(false);
                            }}
                        >
                            <Circle
                                size={'10px'}
                                fillcolor={nested ? '' : textColorMap[theme]}
                            />
                            <RadioText>P2WPKH</RadioText>
                        </ColorButton>
                        <ColorButton
                            color={color}
                            onClick={() => {
                                setNested(true);
                            }}
                        >
                            <Circle
                                size={'10px'}
                                fillcolor={nested ? textColorMap[theme] : ''}
                            />
                            <RadioText>NP2WPKH</RadioText>
                        </ColorButton>
                    </ResponsiveLine>
                </ButtonRow>
                <SecureButton
                    callback={createAddress}
                    variables={{ nested }}
                    disabled={received}
                    withMargin={width <= 578 ? '16px 0 0' : '0 0 0 16px'}
                    arrow={true}
                    loading={loading}
                    fullWidth={width <= 578}
                >
                    Create Address
                </SecureButton>
            </ResponsiveLine>
            {data && data.createAddress && (
                <>
                    <Separation />
                    <ResponsiveLine>
                        <DarkSubTitle>New Address:</DarkSubTitle>
                        {data.createAddress}
                    </ResponsiveLine>
                </>
            )}
        </>
    );
};
