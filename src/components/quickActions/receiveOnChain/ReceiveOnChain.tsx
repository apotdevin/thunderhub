import React, { useState, useEffect } from 'react';
import {
    Card,
    ColorButton,
    NoWrapTitle,
    DarkSubTitle,
    Separation,
} from '../../generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ADDRESS } from '../../../graphql/mutation';
import { Edit, Circle } from '../../generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { useAccount } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';

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
    const [nested, setNested] = useState(false);
    const [received, setReceived] = useState(false);

    const { host, read, cert } = useAccount();
    const auth = getAuthString(host, read, cert);

    const [createAddress, { data }] = useMutation(CREATE_ADDRESS, {
        onError: error => toast.error(getErrorContent(error)),
    });

    useEffect(() => {
        data && data.createAddress && setReceived(true);
    }, [data]);

    return (
        <Card>
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
                            fillcolor={nested ? '' : 'white'}
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
                            fillcolor={nested ? 'white' : ''}
                        />
                        <RadioText>NP2WPKH</RadioText>
                    </ColorButton>
                </ButtonRow>
                <ColorButton
                    color={color}
                    disabled={received}
                    onClick={() => {
                        createAddress({ variables: { auth, nested } });
                    }}
                >
                    <Edit />
                    Create Address
                </ColorButton>
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
        </Card>
    );
};
