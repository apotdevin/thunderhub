import React from 'react';
import {
  isFuture,
  format,
  formatDistanceToNowStrict,
  differenceInCalendarDays,
  isToday,
} from 'date-fns';
import { X, Copy } from 'react-feather';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import getConfig from 'next/config';
import {
  SmallLink,
  DarkSubTitle,
  OverflowText,
  SingleLine,
  CopyIcon,
} from './Styled';
import { StatusDot, DetailLine } from './CardGeneric';

const { publicRuntimeConfig } = getConfig();
const { disableLinks, mempoolUrl } = publicRuntimeConfig;

export const shorten = (text: string, length?: number): string => {
  if (!text) return '';
  const amount = length || 6;
  const beginning = text.slice(0, amount);
  const end = text.slice(text.length - amount);

  return `${beginning}...${end}`;
};

export const addEllipsis = (
  text: string | null | undefined,
  length = 14
): string => {
  if (!text) return '';

  const textLength = text.length;

  if (textLength <= length) {
    return text;
  }

  const beginning = text.slice(0, length);

  return `${beginning}...`;
};

export const copyLink = (text: string) => (
  <CopyToClipboard text={text} onCopy={() => toast.success('Copied')}>
    <CopyIcon>
      <Copy size={12} />
    </CopyIcon>
  </CopyToClipboard>
);

export const getAddressLink = (transaction: string | null | undefined) => {
  if (!transaction) return null;
  if (disableLinks) {
    return (
      <>
        {shorten(transaction)}
        {copyLink(transaction)}
      </>
    );
  }
  const link = `${mempoolUrl}/address/${transaction}`;
  return (
    <>
      <SmallLink href={link} target="_blank">
        {shorten(transaction)}
      </SmallLink>
      {copyLink(transaction)}
    </>
  );
};

export const getTransactionLink = (transaction: string | null | undefined) => {
  if (!transaction) return null;
  if (disableLinks) {
    return (
      <>
        {shorten(transaction)}
        {copyLink(transaction)}
      </>
    );
  }
  const link = `${mempoolUrl}/tx/${transaction}`;
  return (
    <>
      <SmallLink href={link} target="_blank">
        {shorten(transaction)}
      </SmallLink>
      {copyLink(transaction)}
    </>
  );
};

export const getWithCopy = (text: string | null | undefined) => {
  if (!text) return null;
  return (
    <>
      {shorten(text)}
      {copyLink(text)}
    </>
  );
};

export const getWithCopyFull = (text: string | null | undefined) => {
  if (!text) return null;
  return (
    <>
      {text}
      {copyLink(text)}
    </>
  );
};

export const getNodeLink = (
  publicKey: string | undefined | null,
  alias?: string | undefined | null
) => {
  if (!publicKey || (alias && alias === 'Node not found')) {
    return 'Node not found';
  }
  const link = `https://amboss.space/node/${publicKey}`;
  const text = alias ? alias : shorten(publicKey);
  return (
    <>
      {disableLinks ? (
        text
      ) : (
        <SmallLink href={link} target="_blank">
          {text}
        </SmallLink>
      )}
      {copyLink(publicKey)}
    </>
  );
};

export const getChannelLink = (id: string) => {
  const link = `https://amboss.space/edge/${id}`;
  return (
    <>
      {disableLinks ? (
        id
      ) : (
        <SmallLink href={link} target="_blank">
          {id}
        </SmallLink>
      )}
      {copyLink(id)}
    </>
  );
};

export const getDateDif = (date: string | null | undefined): string | null => {
  if (!date) return null;
  return formatDistanceToNowStrict(new Date(date));
};

export const getPastFutureStr = (
  date: string | null | undefined
): string | null => {
  if (!date) return null;
  return isFuture(new Date(date)) ? 'from now' : 'ago';
};

export const getFormatDate = (
  date: string | null | undefined
): string | null => {
  if (!date) return null;
  return format(new Date(date), 'dd/MM/yyyy - HH:mm:ss');
};

export const getMessageDate = (
  date: string | null | undefined,
  formatType?: string
): string => {
  if (!date) return '';
  let distance = formatDistanceToNowStrict(new Date(date));

  if (distance.indexOf('minute') >= 0 || distance.indexOf('second') >= 0) {
    distance = distance.replace('minutes', 'min');
    distance = distance.replace('minute', 'min');
    distance = distance.replace('seconds', 'sec');
    distance = distance.replace('second', 'sec');
    distance = distance.replace('0 sec', 'now');
    return distance;
  }
  return format(new Date(date), formatType || 'HH:mm');
};

export const getDayChange = (date: string): string => {
  if (isToday(new Date(date))) {
    return 'Today';
  }

  return format(new Date(date), 'dd/MM/yy');
};

export const getIsDifferentDay = (current: string, next: string): boolean => {
  const today = new Date(current);
  const tomorrow = new Date(next);

  const difference = differenceInCalendarDays(today, tomorrow);

  return difference > 0 ? true : false;
};

export const getStatusDot = (status: boolean, type: string) => {
  if (type === 'active') {
    return status ? (
      <StatusDot color="#95de64" />
    ) : (
      <StatusDot color="#ff4d4f" />
    );
  }
  if (type === 'opening') {
    return status ? <StatusDot color="#13c2c2" /> : null;
  }
  return status ? <StatusDot color="#ff4d4f" /> : null;
};

export const renderLine = (
  title: string | number,
  content: number | string | JSX.Element | undefined | null,
  key?: string | number,
  deleteCallback?: () => void
): JSX.Element | null => {
  if (!content) return null;
  return (
    <DetailLine key={key}>
      <DarkSubTitle>{title}</DarkSubTitle>
      <SingleLine>
        <OverflowText>{content}</OverflowText>
        {deleteCallback && (
          <div
            role={'button'}
            tabIndex={0}
            style={{ margin: '0 0 -4px 4px' }}
            onClick={deleteCallback}
            onKeyDown={deleteCallback}
          >
            <X size={18} />
          </div>
        )}
      </SingleLine>
    </DetailLine>
  );
};
