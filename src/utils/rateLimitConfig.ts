interface RateConfigProps {
    [key: string]: {
        max: number;
        window: string;
    };
}

export const RateConfig: RateConfigProps = {
    channelBalance: { max: 3, window: '1s' },
    channelFees: { max: 3, window: '1s' },
    channels: { max: 3, window: '1s' },
    channelReport: { max: 3, window: '1s' },
    closedChannels: { max: 3, window: '1s' },
    pendingChannels: { max: 3, window: '1s' },
    bitcoinFee: { max: 3, window: '1s' },
    bitcoinPrice: { max: 3, window: '1s' },
    getInOut: { max: 3, window: '1s' },
    chainBalance: { max: 3, window: '1s' },
    pendingChainBalance: { max: 3, window: '1s' },
    networkInfo: { max: 3, window: '1s' },
    nodeInfo: { max: 3, window: '1s' },
    forwards: { max: 3, window: '1s' },
    invoices: { max: 3, window: '1s' },
    payments: { max: 3, window: '1s' },
    forwardChannels: { max: 3, window: '1s' },
    forwardReport: { max: 3, window: '1s' },
    getRoute: { max: 3, window: '1s' },
    closeChannel: { max: 3, window: '1s' },
    openChannel: { max: 3, window: '1s' },
    createInvoice: { max: 3, window: '1s' },
    decode: { max: 3, window: '1s' },
    parsePayment: { max: 3, window: '1s' },
    pay: { max: 3, window: '1s' },
    getAddress: { max: 3, window: '1s' },
    sendToAddress: { max: 3, window: '1s' },
    getBackups: { max: 3, window: '1s' },
    verifyBackups: { max: 3, window: '1s' },
    recoverFunds: { max: 3, window: '1s' },
    updateFees: { max: 3, window: '1s' },
    chainTransactions: { max: 3, window: '1s' },
    getRoutes: { max: 3, window: '1s' },
    payViaRoute: { max: 3, window: '1s' },
};
