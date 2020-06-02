import { getChannels, getChannel, getWalletInfo } from 'ln-service';
import { getCorrectAuth, getAuthLnd } from 'server/helpers/helpers';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to, toWithError } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { ContextType } from 'server/types/apiTypes';
import { getFeeScore, getAverage, getMyFeeScore } from '../helpers';

type ChannelFeesType = {
  id: string;
  partnerBaseFee: number;
  partnerFeeRate: number;
  myBaseFee: number;
  myFeeRate: number;
};

export default async (_: undefined, params: any, context: ContextType) => {
  await requestLimiter(context.ip, 'getVolumeHealth');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const { public_key } = await to(getWalletInfo({ lnd }));
  const { channels } = await to(getChannels({ lnd }));

  const channelList = channels.map(c => c.id);

  const getChannelList = () =>
    Promise.all(
      channelList
        .map(async channel => {
          const [{ policies }, channelError] = await toWithError(
            getChannel({
              lnd,
              id: channel,
            })
          );

          if (channelError) {
            logger.debug(
              `Error getting channel with id ${channel.id}: %o`,
              channelError
            );
            return;
          }

          let partnerBaseFee = 0;
          let partnerFeeRate = 0;
          let myBaseFee = 0;
          let myFeeRate = 0;

          if (!channelError && policies) {
            for (let i = 0; i < policies.length; i++) {
              const policy = policies[i];

              if (policy.public_key === public_key) {
                myBaseFee = policy.base_fee_mtokens;
                myFeeRate = policy.fee_rate;
              } else {
                partnerBaseFee = policy.base_fee_mtokens;
                partnerFeeRate = policy.fee_rate;
              }
            }
          }

          return {
            id: channel,
            partnerBaseFee,
            partnerFeeRate,
            myBaseFee,
            myFeeRate,
          };
        })
        .filter(Boolean)
    );

  const list = await getChannelList();

  const health = list.map((channel: ChannelFeesType) => {
    const partnerRateScore = getFeeScore(2000, channel.partnerFeeRate);
    const partnerBaseScore = getFeeScore(100000, channel.partnerBaseFee);
    const myRateScore = getMyFeeScore(2000, channel.myFeeRate, 200);
    const myBaseScore = getMyFeeScore(100000, channel.myBaseFee, 10000);

    const partnerScore = Math.round(
      getAverage([partnerBaseScore, partnerRateScore])
    );
    const myScore = Math.round(getAverage([myRateScore, myBaseScore]));

    return { id: channel.id, partnerScore, myScore };
  });

  const score = Math.round(
    getAverage([
      ...health.map(c => c.partnerScore),
      ...health.map(c => c.myScore),
    ])
  );

  return {
    score,
    channels: health,
  };
};
