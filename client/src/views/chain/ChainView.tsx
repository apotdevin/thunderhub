import React from 'react';

import { ChainTransactions } from './transactions/ChainTransactions';
import { ChainUtxos } from './utxos/ChainUtxos';

export const ChainView = () => {
    return (
        <>
            <ChainUtxos />
            <ChainTransactions />
        </>
    );
};
