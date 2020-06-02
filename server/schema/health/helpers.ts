import { groupBy } from 'underscore';

export const getChannelVolume = forwards => {
  const orderedIncoming = groupBy(forwards, f => f.incoming_channel);
  const orderedOutgoing = groupBy(forwards, f => f.outgoing_channel);

  const reducedIncoming = reduceTokens(orderedIncoming);
  const reducedOutgoing = reduceTokens(orderedOutgoing);

  const together = groupBy(
    [...reducedIncoming, ...reducedOutgoing],
    c => c.channel
  );
  return reduceTokens(together);
};

const reduceTokens = array => {
  const reducedArray = [];
  for (const key in array) {
    if (Object.prototype.hasOwnProperty.call(array, key)) {
      const channel = array[key];
      const reduced = channel.reduce((a, b) => a + b.tokens, 0);
      reducedArray.push({ channel: key, tokens: reduced });
    }
  }
  return reducedArray;
};

export const getChannelIdInfo = (
  id: string
): { blockHeight: number; transaction: number; output: number } | null => {
  const format = /^\d*x\d*x\d*$/;

  if (!format.test(id)) return null;

  const separate = id.split('x');

  return {
    blockHeight: Number(separate[0]),
    transaction: Number(separate[1]),
    output: Number(separate[2]),
  };
};

export const getAverage = (array: number[]): number => {
  const sum = array.reduce((a, b) => a + b, 0);
  return sum / array.length || 0;
};

export const getFeeScore = (max: number, current: number): number => {
  const score = Math.round(((max - current) / max) * 100);
  return Math.max(0, Math.min(100, score));
};

export const getMyFeeScore = (max: number, current: number, min: number) => {
  if (current < min) {
    const score = Math.round(((min - current) / min) * 100);
    return 100 - Math.max(0, Math.min(100, score));
  } else {
    const minimum = current - min;
    const maximum = max - min;
    const score = Math.round(1 - ((maximum - minimum) / maximum) * 100 + 100);
    return Math.max(100, Math.min(200, score));
  }
};
