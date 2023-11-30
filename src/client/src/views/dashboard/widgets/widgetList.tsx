import { FC } from 'react';
import { MempoolWidget } from './external/mempool';
import {
  ChainBalance,
  ChannelBalance,
  FedimintBalance,
  TotalBalance,
} from './lightning/balances';
import { ChannelListWidget } from './lightning/channels';
import { ForwardListWidget } from './lightning/forwards';
import { ForwardsGraph } from './lightning/forwardsGraph';
import { AliasWidget, BalanceWidget } from './lightning/info';
import { InvoicesGraph } from './lightning/invoiceGraph';
import { LiquidityGraph } from './lightning/liquidityGraph';
import {
  CreateInvoice,
  OpenChannel,
  PayInvoice,
  ReceiveOnChain,
  SendOnChain,
} from './lightning/modal';
import { PaymentsGraph } from './lightning/paymentGraph';
import {
  ChannelViewLink,
  DashSettingsLink,
  ForwardsViewLink,
  RebalanceViewLink,
  TransactionsViewLink,
} from './link';
import { CurrencySetting, ThemeSetting } from './settings';
import { ConvertWidget } from './util/Convert';
import { DonateWidget } from './util/DonateWidget';
import { SignWidget } from './util/Sign';

export const widgetDefaults = {
  width: 4,
  height: 8,
};

export type WidgetProps = {
  id: number;
  name: string;
  group: string;
  subgroup: string;
  hidden?: boolean;
  component: FC;
  default: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
  };
};

const defaultProps = {
  x: 0,
  y: Infinity,
  w: widgetDefaults.width,
  h: widgetDefaults.height,
};

export const widgetList: WidgetProps[] = [
  {
    id: 1,
    name: 'Theme',
    group: 'Settings',
    subgroup: '',
    component: ThemeSetting,
    default: { ...defaultProps, w: 2, h: 2 },
  },
  {
    id: 2,
    name: 'Currency',
    group: 'Settings',
    subgroup: '',
    component: CurrencySetting,
    default: { ...defaultProps, w: 2, h: 2 },
  },
  {
    id: 3,
    name: 'Mempool Fees',
    group: 'External',
    subgroup: '',
    component: MempoolWidget,
    default: { ...defaultProps, w: 4, h: 3 },
  },
  {
    id: 4,
    name: 'Total Balance',
    group: 'Lightning',
    subgroup: 'Info',
    component: TotalBalance,
    default: { ...defaultProps, w: 2, h: 3 },
  },
  {
    id: 5,
    name: 'Channel Balance',
    group: 'Lightning',
    subgroup: 'Info',
    component: ChannelBalance,
    default: { ...defaultProps, w: 2, h: 3 },
  },
  {
    id: 6,
    name: 'Chain Balance',
    group: 'Lightning',
    subgroup: 'Info',
    component: ChainBalance,
    default: { ...defaultProps, w: 2, h: 3 },
  },
  {
    id: 6,
    name: 'Fedimint Balance',
    group: 'Lightning',
    subgroup: 'Info',
    component: FedimintBalance,
    default: { ...defaultProps, w: 2, h: 3 },
  },
  {
    id: 7,
    name: 'Alias',
    group: 'Lightning',
    subgroup: 'Info',
    component: AliasWidget,
    default: { ...defaultProps, w: 2, h: 2 },
  },
  {
    id: 9,
    name: 'Forwards',
    group: 'Lightning',
    subgroup: 'Table',
    component: ForwardListWidget,
    default: { ...defaultProps, w: 5, h: 16, minW: 3 },
  },
  {
    id: 10,
    name: 'Forwards',
    group: 'Lightning',
    subgroup: 'Graph',
    component: ForwardsGraph,
    default: { ...defaultProps, w: 8, h: 16, minW: 5, minH: 8 },
  },
  {
    id: 12,
    name: 'Invoices',
    group: 'Lightning',
    subgroup: 'Graph',
    component: InvoicesGraph,
    default: { ...defaultProps, w: 8, h: 16, minW: 5, minH: 8 },
  },
  {
    id: 13,
    name: 'Payments',
    group: 'Lightning',
    subgroup: 'Graph',
    component: PaymentsGraph,
    default: { ...defaultProps, w: 8, h: 16, minW: 5, minH: 8 },
  },
  {
    id: 14,
    name: 'Pay Invoice',
    group: 'Lightning',
    subgroup: 'Action',
    component: PayInvoice,
    default: { ...defaultProps, w: 2, h: 2, minH: 2, maxH: 2 },
  },
  {
    id: 15,
    name: 'Create Invoice',
    group: 'Lightning',
    subgroup: 'Action',
    component: CreateInvoice,
    default: { ...defaultProps, w: 2, h: 2, minH: 2, maxH: 2 },
  },
  {
    id: 16,
    name: 'Send Bitcoin',
    group: 'Lightning',
    subgroup: 'Action',
    component: SendOnChain,
    default: { ...defaultProps, w: 2, h: 2, minH: 2, maxH: 2 },
  },
  {
    id: 17,
    name: 'Receive Bitcoin',
    group: 'Lightning',
    subgroup: 'Action',
    component: ReceiveOnChain,
    default: { ...defaultProps, w: 2, h: 2, minH: 2, maxH: 2 },
  },
  {
    id: 18,
    name: 'Dashboard Settings',
    group: 'Link',
    subgroup: '',
    component: DashSettingsLink,
    default: { ...defaultProps, w: 2, h: 2 },
  },
  {
    id: 19,
    name: 'Forwards View',
    group: 'Link',
    subgroup: '',
    component: ForwardsViewLink,
    default: { ...defaultProps, w: 2, h: 2 },
  },
  {
    id: 20,
    name: 'Transactions View',
    group: 'Link',
    subgroup: '',
    component: TransactionsViewLink,
    default: { ...defaultProps, w: 2, h: 2 },
  },
  {
    id: 21,
    name: 'Channel View',
    group: 'Link',
    subgroup: '',
    component: ChannelViewLink,
    default: { ...defaultProps, w: 2, h: 2 },
  },
  {
    id: 22,
    name: 'Rebalance View',
    group: 'Link',
    subgroup: '',
    component: RebalanceViewLink,
    default: { ...defaultProps, w: 2, h: 2 },
  },
  {
    id: 23,
    name: 'Open Channel',
    group: 'Lightning',
    subgroup: 'Action',
    component: OpenChannel,
    default: { ...defaultProps, w: 2, h: 2, minH: 2, maxH: 2 },
  },
  {
    id: 24,
    name: 'Convert',
    group: 'Utils',
    subgroup: '',
    component: ConvertWidget,
    default: { ...defaultProps, w: 4, h: 4, minW: 3, minH: 4, maxH: 4 },
  },
  {
    id: 25,
    name: 'Liquidity',
    group: 'Lightning',
    subgroup: 'Graph',
    component: LiquidityGraph,
    default: { ...defaultProps, w: 8, h: 8, minW: 5, minH: 6 },
  },
  {
    id: 26,
    name: 'Balance',
    group: 'Lightning',
    subgroup: 'Info',
    component: BalanceWidget,
    default: { ...defaultProps, w: 1, h: 2 },
  },
  {
    id: 27,
    name: 'Channels',
    group: 'Lightning',
    subgroup: 'Table',
    component: ChannelListWidget,
    default: { ...defaultProps, w: 9, h: 16, minW: 9 },
  },
  {
    id: 28,
    name: 'Donate',
    group: 'Utils',
    subgroup: '',
    hidden: true,
    component: DonateWidget,
    default: { ...defaultProps, w: 2, h: 2, minH: 2, maxH: 2 },
  },
  {
    id: 29,
    name: 'Sign Message',
    group: 'Utils',
    subgroup: '',
    component: SignWidget,
    default: { ...defaultProps, w: 2, h: 2, minH: 2, maxH: 2 },
  },
];
