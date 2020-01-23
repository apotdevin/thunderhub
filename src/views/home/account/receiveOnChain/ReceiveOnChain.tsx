import React, { useState, useEffect } from 'react';
import {
    ColorButton,
    NoWrapTitle,
    DarkSubTitle,
    Separation,
} from '../../../../components/generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ADDRESS } from '../../../../graphql/mutation';
import { Edit, Circle } from '../../../../components/generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { textColorMap } from '../../../../styles/Themes';
import { useSettings } from '../../../../context/SettingsContext';

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

export const ReceiveOnChainCard = ({ color }: { color: string }) => {
    const { theme } = useSettings();

    const [nested, setNested] = useState(false);
    const [received, setReceived] = useState(false);

    const [createAddress, { data }] = useMutation(CREATE_ADDRESS, {
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        data && data.createAddress && setReceived(true);
    }, [data]);

    return (
        <>
            <SingleLine>
                <ButtonRow>
                    <TitleWithSpacing>Type of Address:</TitleWithSpacing>
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
                </ButtonRow>
                <SecureButton
                    callback={createAddress}
                    variables={{ nested }}
                    disabled={received}
                    withMargin={'0 0 0 16px'}
                    arrow={true}
                >
                    <Edit />
                    Create Address
                </SecureButton>
            </SingleLine>
            {data && data.createAddress && (
                <>
                    <Separation />
                    <SingleLine>
                        <DarkSubTitle>New Address:</DarkSubTitle>
                        {data.createAddress}
                    </SingleLine>
                </>
            )}
        </>
    );
};
