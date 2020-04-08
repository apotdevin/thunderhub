import { reduce, groupBy } from 'underscore';
import {
    ForwardProps,
    ReduceObjectProps,
    ListProps,
} from './ForwardReport.interface';
import { InOutListProps, InOutProps } from '../flow/getInOut.interface';

export const reduceForwardArray = (list: ListProps) => {
    const reducedOrder = [];
    for (const key in list) {
        if (list.hasOwnProperty(key)) {
            const element: ForwardProps[] = list[key];
            const reducedArray: ReduceObjectProps = reduce(element, (a, b) => {
                return {
                    fee: a.fee + b.fee,
                    tokens: a.tokens + b.tokens,
                };
            });
            reducedOrder.push({
                period: parseInt(key),
                amount: element.length,
                ...reducedArray,
            });
        }
    }

    return reducedOrder;
};

export const reduceInOutArray = (list: InOutListProps) => {
    const reducedOrder = [];
    for (const key in list) {
        if (list.hasOwnProperty(key)) {
            const element: InOutProps[] = list[key];
            const reducedArray: InOutProps = reduce(element, (a, b) => ({
                tokens: a.tokens + b.tokens,
            }));
            reducedOrder.push({
                period: parseInt(key),
                amount: element.length,
                tokens: reducedArray.tokens,
            });
        }
    }
    return reducedOrder;
};

export const countArray = (list: ForwardProps[], type: boolean) => {
    const inOrOut = type ? 'incoming_channel' : 'outgoing_channel';
    const grouped = groupBy(list, inOrOut);

    const channelInfo = [];
    for (const key in grouped) {
        if (grouped.hasOwnProperty(key)) {
            const element = grouped[key];

            const fee = element
                .map((forward) => forward.fee)
                .reduce((p, c) => p + c);

            const tokens = element
                .map((forward) => forward.tokens)
                .reduce((p, c) => p + c);

            channelInfo.push({
                name: key,
                amount: element.length,
                fee: fee,
                tokens: tokens,
            });
        }
    }

    return channelInfo;
};

export const countRoutes = (list: ForwardProps[]) => {
    const grouped = groupBy(list, 'route');

    const channelInfo = [];
    for (const key in grouped) {
        if (grouped.hasOwnProperty(key)) {
            const element = grouped[key];

            const fee = element
                .map((forward) => forward.fee)
                .reduce((p, c) => p + c);

            const tokens = element
                .map((forward) => forward.tokens)
                .reduce((p, c) => p + c);

            channelInfo.push({
                route: key,
                in: element[0].incoming_channel,
                out: element[0].outgoing_channel,
                amount: element.length,
                fee: fee,
                tokens: tokens,
            });
        }
    }

    return channelInfo;
};
