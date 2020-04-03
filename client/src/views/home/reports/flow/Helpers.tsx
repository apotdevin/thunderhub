import { PeriodProps, WaterfallProps } from './';

export const getWaterfall = (
    invoices: PeriodProps[],
    payments: PeriodProps[],
): WaterfallProps[] => {
    const initialInvoicePeriod = invoices[0]?.period;
    const initialPaymentPeriod = payments[0]?.period;

    const initialPeriod = Math.min(initialInvoicePeriod, initialPaymentPeriod);

    const lastInvoicePeriod = invoices[invoices.length - 1]?.period;
    const lastPaymentPeriod = payments[payments.length - 1]?.period;

    const lastPeriod = Math.max(lastInvoicePeriod, lastPaymentPeriod);

    let waterfall = [];

    let previousAmount = 0;
    let previousTokens = 0;

    for (let i = initialPeriod; i <= lastPeriod; i++) {
        const currentInvoice = invoices.find(
            (invoice) => invoice.period === i,
        ) ?? { period: undefined, amount: 0, tokens: 0 };
        const currentPayment = payments.find(
            (payment) => payment.period === i,
        ) ?? { period: undefined, amount: 0, tokens: 0 };

        const amountChange = currentInvoice.amount - currentPayment.amount;
        const tokensChange = currentInvoice.tokens - currentPayment.tokens;

        if (waterfall.length <= 0) {
            waterfall.push({
                period: i,
                amount: amountChange,
                tokens: tokensChange,
                amountBefore: 0,
                tokensBefore: 0,
            });

            previousAmount = amountChange;
            previousTokens = tokensChange;
        } else if (currentInvoice.period || currentPayment.period) {
            waterfall.push({
                period: i,
                amount: amountChange + previousAmount,
                tokens: tokensChange + previousTokens,
                amountBefore: previousAmount,
                tokensBefore: previousTokens,
            });

            previousAmount = amountChange + previousAmount;
            previousTokens = tokensChange + previousTokens;
        }
    }

    return waterfall;
};
