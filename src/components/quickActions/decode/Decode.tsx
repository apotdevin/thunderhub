import React, { useState, useContext } from 'react';
import {
    Card,
    Sub4Title,
    Input,
    SingleLine,
    Separation,
    DarkSubTitle,
    ColorButton,
} from '../../generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { Layers } from '../../generic/Icons';
import { AccountContext } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { DECODE_REQUEST } from '../../../graphql/mutation';
import { getErrorContent } from '../../../utils/error';
import { toast } from 'react-toastify';
import { getLoadingButton, getValue } from '../../../helpers/Helpers';
import { DetailLine } from '../../channels/Channels.style';
import { getNodeLink } from '../../generic/Helpers';
import { SettingsContext } from '../../../context/SettingsContext';

export const DecodeCard = ({ color }: { color: string }) => {
    const [request, setRequest] = useState('');

    const { price, symbol, currency, theme } = useContext(SettingsContext);
    const priceProps = { price, symbol, currency };

    const { host, read, cert } = useContext(AccountContext);
    const auth = getAuthString(host, read, cert);

    const [decode, { data, loading }] = useMutation(DECODE_REQUEST, {
        onError: error => toast.error(getErrorContent(error)),
    });

    const getFormat = (amount: string) =>
        getValue({
            amount,
            ...priceProps,
        });

    const renderValue = (value: string, type?: string) => {
        switch (type) {
            case 'node_link':
                return getNodeLink(value);
            case 'value':
                return getFormat(value);
            default:
                return value;
        }
    };

    const renderLine = (title: string, value: string, type?: string) => {
        if (!value) {
            return null;
        }
        return (
            <DetailLine>
                <DarkSubTitle>{title}</DarkSubTitle>
                {renderValue(value, type)}
            </DetailLine>
        );
    };

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
            // routes,
            tokens,
        } = data.decodeRequest;

        return (
            <>
                <Separation />
                {renderLine('Id:', id)}
                {renderLine('Destination:', destination, 'node_link')}
                {renderLine('Description:', description)}
                {renderLine('Description Hash:', descriptionHash)}
                {renderLine('Chain Address:', chainAddress)}
                {renderLine('CLTV Delta:', cltvDelta)}
                {renderLine('Expires At:', expiresAt)}
                {renderLine('Amount:', tokens, 'value')}
            </>
        );
    };

    console.log(data);

    return (
        <Card bottom={'20px'}>
            <SingleLine>
                <Sub4Title>Request:</Sub4Title>
                <Input
                    color={color}
                    value={request}
                    onChange={e => setRequest(e.target.value)}
                />
                <ColorButton
                    color={color}
                    disabled={request === ''}
                    enabled={request !== ''}
                    onClick={() => {
                        setRequest('');
                        decode({ variables: { request, auth } });
                    }}
                >
                    {getLoadingButton(Layers, loading, 'Decode')}
                </ColorButton>
            </SingleLine>
            {renderData()}
        </Card>
    );
};
