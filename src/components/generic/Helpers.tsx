import React from 'react';
import { SmallLink, DarkSubTitle } from './Styled';
import { StatusDot, DetailLine } from '../channels/Channels.style';
import { DownArrow, UpArrow, EyeOff } from './Icons';
import { formatDistanceStrict, format } from 'date-fns';

export const getTransactionLink = (transaction: string) => {
    const link = `https://www.blockchain.com/btc/tx/${transaction}`;
    return (
        <SmallLink href={link} target="_blank">
            {transaction}
        </SmallLink>
    );
};

export const getNodeLink = (publicKey: string) => {
    const link = `https://1ml.com/node/${publicKey}`;
    return (
        <SmallLink href={link} target="_blank">
            {publicKey}
        </SmallLink>
    );
};

export const getDateDif = (date: string) => {
    return formatDistanceStrict(new Date(date), new Date());
};

export const getFormatDate = (date: string) => {
    return format(new Date(date), 'dd-MM-yyyy - HH:mm:ss');
};

export const getTooltipType = (theme: string) => {
    return theme === 'dark' ? 'light' : undefined;
};

export const getStatusDot = (status: boolean, type: string) => {
    if (type === 'active') {
        return status ? (
            <StatusDot color="#95de64" />
        ) : (
            <StatusDot color="#ff4d4f" />
        );
    } else if (type === 'opening') {
        return status ? <StatusDot color="#13c2c2" /> : null;
    } else {
        return status ? <StatusDot color="#ff4d4f" /> : null;
    }
};

export const getSymbol = (status: boolean) => {
    return status ? <DownArrow /> : <UpArrow />;
};

export const getPrivate = (status: boolean) => {
    return status && <EyeOff />;
};

export const renderLine = (title: string, content: any) => {
    if (!content) return null;
    return (
        <DetailLine>
            <DarkSubTitle bottom={'0px'}>{title}</DarkSubTitle>
            {content}
        </DetailLine>
    );
};
