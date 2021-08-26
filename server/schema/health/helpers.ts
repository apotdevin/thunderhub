import { groupBy } from 'lodash';
import { ForwardType } from 'server/types/ln-service.types';

type GroupedObject = {
  [key: string]: ForwardType[];
};

type TotalGroupedObject = {
  [key: string]: { tokens: number }[];
};

export const getChannelVolume = (forwards: ForwardType[]) => {
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

const reduceTokens = (array: GroupedObject | TotalGroupedObject) => {
  const reducedArray = [];
  for (const key in array) {
    if (Object.prototype.hasOwnProperty.call(array, key)) {
      const channel: { tokens: number }[] = array[key];
      const reduced = channel.reduce((a, b) => a + b.tokens, 0);
      reducedArray.push({ channel: key, tokens: reduced });
    }
  }
  return reducedArray;
};

export const getChannelAge = (id: string, currentHeight: number): number => {
  const info = getChannelIdInfo(id);
  if (!info) return 0;
  return currentHeight - info.blockHeight;
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

export const getMyFeeScore = (
  max: number,
  current: number,
  min: number
): { over: boolean; score: number } => {
  if (current === min) {
    return { over: false, score: 100 };
  }
  if (current < min) {
    const score = Math.round(((min - current) / min) * 100);
    return { over: false, score: 100 - Math.max(0, Math.min(100, score)) };
  }
  const minimum = current - min;
  const maximum = max - min;
  const score = Math.round(((maximum - minimum) / maximum) * 100);

  return { over: true, score: Math.max(0, Math.min(100, score)) };
};
