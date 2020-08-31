import { getChannels, getChannel, getWalletInfo } from 'ln-service';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to, toWithError } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { ContextType } from 'server/types/apiTypes';
import { GetChannelsType, GetChannelType } from 'server/types/ln-service.types';
import { getFeeScore, getAverage, getMyFeeScore } from '../helpers';

type ChannelFeesType = {
  id: string;
  publicKey: string;
  partnerBaseFee: number;
  partnerFeeRate: number;
  myBaseFee: number;
  myFeeRate: number;
};

export default async (_: undefined, params: any, context: ContextType) => {
  await requestLimiter(context.ip, 'getFeeHealth');

  const { lnd } = context;

  const { public_key } = await to(getWalletInfo({ lnd }));
  const { channels } = await to<GetChannelsType>(getChannels({ lnd }));

  const getChannelList = () =>
    Promise.all(
      channels
        .map(async channel => {
          const { id, partner_public_key: publicKey } = channel;
          const [channelInfo, channelError] = await toWithError(
            getChannel({
              lnd,
              id,
            })
          );

          if (channelError || !channelInfo) {
            logger.debug(
              `Error getting channel with id ${id}: %o`,
              channelError
            );
            return null;
          }

          const policies = (channelInfo as GetChannelType).policies;

          let partnerBaseFee = 0;
          let partnerFeeRate = 0;
          let myBaseFee = 0;
          let myFeeRate = 0;

          if (!channelError && policies) {
            for (let i = 0; i < policies.length; i++) {
              const policy = policies[i];

              if (policy.public_key === public_key) {
                myBaseFee = Number(policy.base_fee_mtokens);
                myFeeRate = policy.fee_rate;
              } else {
                partnerBaseFee = Number(policy.base_fee_mtokens);
                partnerFeeRate = policy.fee_rate;
              }
            }
          }

          return {
            id,
            publicKey,
            partnerBaseFee,
            partnerFeeRate,
            myBaseFee,
            myFeeRate,
          };
        })
        .filter(Boolean)
    );

  const list = await getChannelList();

  const health = (list as ChannelFeesType[]).map((channel: ChannelFeesType) => {
    const partnerRateScore = getFeeScore(2000, channel.partnerFeeRate);
    const partnerBaseScore = getFeeScore(100000, channel.partnerBaseFee);
    const myRateScore = getMyFeeScore(2000, channel.myFeeRate, 200);
    const myBaseScore = getMyFeeScore(100000, channel.myBaseFee, 1000);

    const partnerScore = Math.round(
      getAverage([partnerBaseScore, partnerRateScore])
    );
    const myScore = Math.round(
      getAverage([myRateScore.score, myBaseScore.score])
    );

    const mySide = {
      score: myScore,
      rate: channel.myFeeRate,
      base: Math.round(channel.myBaseFee / 1000),
      rateScore: myRateScore.score,
      baseScore: myBaseScore.score,
      rateOver: myRateScore.over,
      baseOver: myBaseScore.over,
    };

    Object.entries(mySide).forEach(entry => {
      const [key, value] = entry;
      if (isNaN(value as number)) {
        logger.debug(`${key} is NAN (getFeeHealth)`);
      }
    });

    const partnerSide = {
      score: partnerScore,
      rate: channel.partnerFeeRate,
      base: Math.round(channel.partnerBaseFee / 1000),
      rateScore: partnerRateScore,
      baseScore: partnerBaseScore,
      rateOver: true,
      baseOver: true,
    };

    Object.entries(partnerSide).forEach(entry => {
      const [key, value] = entry;
      if (isNaN(value as number)) {
        logger.debug(`${key} is NAN (getFeeHealth)`);
      }
    });

    return {
      id: channel.id,
      partnerSide,
      mySide,
      partner: { publicKey: channel.publicKey, lnd },
    };
  });

  const score = Math.round(
    getAverage([
      ...health.map(c => c.partnerSide.score),
      ...health.map(c => c.mySide.score),
    ])
  );

  return {
    score,
    channels: health,
  };
};
