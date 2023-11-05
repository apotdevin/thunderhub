import { forOwn, mapValues, orderBy } from 'lodash';
import {
  AggregatedByChannelSide,
  AggregatedByRoute,
  ForwardsWithPubkey,
} from './forwards.types';
import Big from 'big.js';
import { v5 as uuidv5 } from 'uuid';

export const reduceByChannel = (
  currentPubkey: string,
  forwards: {
    [key: string]: ForwardsWithPubkey[];
  }
): AggregatedByChannelSide[] => {
  const aggregated = [];

  forOwn(forwards, (value, key) => {
    const reduced = value.reduce(
      (p, c) => {
        if (!c) return p;

        return {
          count: p.count.plus(1),
          fee: p.fee.plus(c.fee),
          fee_mtokens: p.fee_mtokens.plus(c.fee_mtokens),
          mtokens: p.mtokens.plus(c.mtokens),
          tokens: p.tokens.plus(c.tokens),
        };
      },
      {
        count: new Big(0),
        fee: new Big(0),
        fee_mtokens: new Big(0),
        mtokens: new Big(0),
        tokens: new Big(0),
      }
    );

    const { count, fee, fee_mtokens, mtokens, tokens } = reduced;

    aggregated.push({
      count: count.toNumber(),
      fee: fee.toNumber(),
      fee_mtokens: fee_mtokens.toNumber(),
      mtokens: mtokens.toNumber(),
      tokens: tokens.toNumber(),
      channel: key,
      currentPubkey,
    });
  });

  const ordered = orderBy(aggregated, 'count', 'desc');

  return ordered;
};

export const reduceByRoute = (
  currentPubkey: string,
  forwards: {
    [key: string]: ForwardsWithPubkey[];
  }
): AggregatedByRoute[] => {
  const aggregated = [];

  forOwn(forwards, (value, key) => {
    const reduced = value.reduce(
      (p, c) => {
        if (!c) return p;

        return {
          count: p.count.plus(1),
          fee: p.fee.plus(c.fee),
          fee_mtokens: p.fee_mtokens.plus(c.fee_mtokens),
          mtokens: p.mtokens.plus(c.mtokens),
          tokens: p.tokens.plus(c.tokens),
          incoming_channel: c.incoming_channel,
          outgoing_channel: c.outgoing_channel,
        };
      },
      {
        count: new Big(0),
        fee: new Big(0),
        fee_mtokens: new Big(0),
        mtokens: new Big(0),
        tokens: new Big(0),
        incoming_channel: '',
        outgoing_channel: '',
      }
    );

    const {
      count,
      fee,
      fee_mtokens,
      mtokens,
      tokens,
      incoming_channel,
      outgoing_channel,
    } = reduced;

    aggregated.push({
      id: uuidv5(key, uuidv5.URL),
      count: count.toNumber(),
      fee: fee.toNumber(),
      fee_mtokens: fee_mtokens.toNumber(),
      mtokens: mtokens.toNumber(),
      tokens: tokens.toNumber(),
      route: key,
      incoming_channel,
      outgoing_channel,
      currentPubkey,
    });
  });

  return orderBy(aggregated, 'count', 'desc');
};

export const mapByChannel = (forwards: {
  [key: string]: ForwardsWithPubkey[];
}) => {
  return mapValues(forwards, value => {
    const reduced = value.reduce(
      (p, c) => {
        if (!c) return p;

        return {
          count: p.count.plus(1),
          fee: p.fee.plus(c.fee),
          fee_mtokens: p.fee_mtokens.plus(c.fee_mtokens),
          mtokens: p.mtokens.plus(c.mtokens),
          tokens: p.tokens.plus(c.tokens),
        };
      },
      {
        count: new Big(0),
        fee: new Big(0),
        fee_mtokens: new Big(0),
        mtokens: new Big(0),
        tokens: new Big(0),
      }
    );

    const { count, fee, fee_mtokens, mtokens, tokens } = reduced;

    return {
      count: count.toNumber(),
      fee: fee.toNumber(),
      fee_mtokens: fee_mtokens.toNumber(),
      mtokens: mtokens.toNumber(),
      tokens: tokens.toNumber(),
    };
  });
};
