import { forOwn } from 'lodash';
import {
  AggregatedByChannelSide,
  AggregatedByRoute,
  ForwardsWithPubkey,
} from './forwards.types';

export const reduceByChannel = (
  currentPubkey: string,
  forwards: {
    [key: string]: ForwardsWithPubkey[];
  }
): AggregatedByChannelSide[] => {
  const aggregated: AggregatedByChannelSide[] = [];

  forOwn(forwards, (value, key) => {
    let count = 0;
    let fee = 0;
    let fee_mtokens = 0;
    let mtokens = 0;
    let tokens = 0;

    for (let i = 0; i < value.length; i++) {
      const c = value[i];
      if (!c) continue;
      count++;
      fee += c.fee || 0;
      fee_mtokens += Number(c.fee_mtokens) || 0;
      mtokens += Number(c.mtokens) || 0;
      tokens += c.tokens || 0;
    }

    aggregated.push({
      count,
      fee,
      fee_mtokens,
      mtokens,
      tokens,
      channel: key,
      currentPubkey,
    });
  });

  return aggregated.sort((a, b) => b.count - a.count);
};

export const reduceByRoute = (
  currentPubkey: string,
  forwards: {
    [key: string]: ForwardsWithPubkey[];
  }
): AggregatedByRoute[] => {
  const aggregated: AggregatedByRoute[] = [];

  forOwn(forwards, (value, key) => {
    let count = 0;
    let fee = 0;
    let fee_mtokens = 0;
    let mtokens = 0;
    let tokens = 0;
    let incoming_channel = '';
    let outgoing_channel = '';

    for (let i = 0; i < value.length; i++) {
      const c = value[i];
      if (!c) continue;
      count++;
      fee += c.fee || 0;
      fee_mtokens += Number(c.fee_mtokens) || 0;
      mtokens += Number(c.mtokens) || 0;
      tokens += c.tokens || 0;
      if (!incoming_channel) incoming_channel = c.incoming_channel;
      if (!outgoing_channel) outgoing_channel = c.outgoing_channel;
    }

    aggregated.push({
      count,
      fee,
      fee_mtokens,
      mtokens,
      tokens,
      route: key,
      incoming_channel,
      outgoing_channel,
      currentPubkey,
    });
  });

  return aggregated.sort((a, b) => b.count - a.count);
};

export const mapByChannel = (forwards: {
  [key: string]: ForwardsWithPubkey[];
}) => {
  const result: Record<
    string,
    {
      count: number;
      fee: number;
      fee_mtokens: number;
      mtokens: number;
      tokens: number;
    }
  > = {};

  forOwn(forwards, (value, key) => {
    let count = 0;
    let fee = 0;
    let fee_mtokens = 0;
    let mtokens = 0;
    let tokens = 0;

    for (let i = 0; i < value.length; i++) {
      const c = value[i];
      if (!c) continue;
      count++;
      fee += c.fee || 0;
      fee_mtokens += Number(c.fee_mtokens) || 0;
      mtokens += Number(c.mtokens) || 0;
      tokens += c.tokens || 0;
    }

    result[key] = { count, fee, fee_mtokens, mtokens, tokens };
  });

  return result;
};
