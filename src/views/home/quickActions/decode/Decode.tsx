import React, { useState } from 'react';
import {
    Card,
    Sub4Title,
    SingleLine,
    Separation,
} from '../../../../components/generic/Styled';
import { renderLine } from '../../../../components/generic/Helpers';
import { useMutation } from '@apollo/react-hooks';
import { useAccount } from '../../../../context/AccountContext';
import { getAuthString } from '../../../../utils/auth';
import { DECODE_REQUEST } from '../../../../graphql/mutation';
import { getErrorContent } from '../../../../utils/error';
import { toast } from 'react-toastify';
import { getValue } from '../../../../helpers/Helpers';
import { getNodeLink } from '../../../../components/generic/Helpers';
import { useSettings } from '../../../../context/SettingsContext';
import styled from 'styled-components';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { Input } from '../../../../components/input/Input';
import { useSize } from '../../../../hooks/UseSize';

const ResponsiveLine = styled(SingleLine)`
    width: 100%;

    @media (max-width: 578px) {
        flex-direction: column;
    }
`;

export const DecodeCard = ({ color }: { color: string }) => {
    const { width } = useSize();
    const [request, setRequest] = useState('');

    const { price, symbol, currency } = useSettings();
    const priceProps = { price, symbol, currency };

    const { host, read, cert, sessionAdmin } = useAccount();
    const auth = getAuthString(host, read !== '' ? read : sessionAdmin, cert);

    const [decode, { data, loading }] = useMutation(DECODE_REQUEST, {
        onError: error => toast.error(getErrorContent(error)),
    });

    const getFormat = (amount: string) =>
        getValue({
            amount,
            ...priceProps,
        });

    const renderData = () => {
        if (!data || !data.decodeRequest) return null;

        const {
            chainAddress,
            cltvDelta,
            description,
            descriptionHash,
            destination,
            expiresAt,
            id,
            tokens,
        } = data.decodeRequest;

        return (
            <>
                <Separation />
                {renderLine('Id:', id)}
                {renderLine('Destination:', getNodeLink(destination))}
                {renderLine('Description:', description)}
                {renderLine('Description Hash:', descriptionHash)}
                {renderLine('Chain Address:', chainAddress)}
                {renderLine('CLTV Delta:', cltvDelta)}
                {renderLine('Expires At:', expiresAt)}
                {renderLine('Amount:', getFormat(tokens))}
            </>
        );
    };

    return (
        <Card bottom={'20px'}>
            <ResponsiveLine>
                <Sub4Title>Request:</Sub4Title>
                <Input
                    placeholder={'Lightning Invoice'}
                    withMargin={width <= 578 ? '0 0 8px' : '0 0 0 24px'}
                    color={color}
                    value={request}
                    onChange={e => setRequest(e.target.value)}
                />
                <ColorButton
                    color={color}
                    disabled={request === ''}
                    withMargin={width <= 578 ? '0' : '0 0 0 16px'}
                    arrow={true}
                    loading={loading}
                    fullWidth={width <= 578}
                    onClick={() => {
                        setRequest('');
                        decode({ variables: { request, auth } });
                    }}
                >
                    Decode
                </ColorButton>
            </ResponsiveLine>
            {renderData()}
        </Card>
    );
};
