import { EventField } from '../../context/EventLogContext';

export const fakeEvents: {
  title: string;
  summary: EventField[];
  details?: EventField[];
  status?: 'success' | 'error';
}[] = [
  {
    title: 'Invoice Paid',
    summary: [{ label: 'Amount', value: '50,000 sats' }],
    details: [
      { label: 'Description', value: 'Monthly VPN subscription' },
      { label: 'Description Hash', value: 'a1b2c3...d4e5f6' },
    ],
  },
  {
    title: 'New Payment',
    summary: [
      { label: 'Amount', value: '125,000 sats' },
      { label: 'Destination', value: 'ACINQ' },
    ],
    details: [
      { label: 'Fee', value: '12 sats' },
      { label: 'Hop 1', value: '824333x2100x1' },
      { label: 'Hop 2', value: '710421x1500x0' },
    ],
  },
  {
    title: 'Successful Forward',
    summary: [{ label: 'Fee', value: '3 sats' }],
    details: [
      { label: 'In Peer', value: 'WalletOfSatoshi' },
      { label: 'Out Peer', value: 'River Financial' },
      { label: 'In Channel', value: '810111x2300x1' },
      { label: 'Out Channel', value: '799000x1800x0' },
    ],
  },
  {
    title: 'Forward Attempt',
    summary: [{ label: 'Tokens', value: '2,000,000 sats' }],
    details: [
      { label: 'In Peer', value: 'Kraken' },
      { label: 'Out Peer', value: 'Bitfinex' },
      { label: 'In Channel', value: '800100x500x2' },
      { label: 'Out Channel', value: '800200x600x1' },
      { label: 'Fee', value: '150 sats' },
    ],
    status: 'error',
  },
  {
    title: 'Channel Closed',
    summary: [
      { label: 'Reason', value: 'Cooperative' },
      { label: 'Capacity', value: '5,000,000 sats' },
    ],
    details: [
      { label: 'Id', value: '750000x1200x0' },
      { label: 'Peer', value: 'LNBig' },
    ],
  },
  {
    title: 'Channel Opened',
    summary: [
      { label: 'Capacity', value: '10,000,000 sats' },
      { label: 'Initiated By', value: 'Your Peer' },
    ],
    details: [
      { label: 'Id', value: '812000x900x1' },
      { label: 'Peer', value: 'Voltage' },
      { label: 'Private', value: 'No' },
      { label: 'Local', value: '0 sats' },
      { label: 'Remote', value: '10,000,000 sats' },
    ],
  },
];
