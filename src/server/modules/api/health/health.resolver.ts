import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { toWithError } from 'src/server/utils/async';
import { Logger } from 'winston';
import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import {
  getAverage,
  getChannelIdInfo,
  getChannelVolume,
  getFeeScore,
  getMyFeeScore,
} from './health.helpers';
import {
  ChannelFeesType,
  ChannelsFeeHealth,
  ChannelsHealth,
  ChannelsTimeHealth,
} from './health.types';
import { subMonths } from 'date-fns';

const halfMonthInMilliSeconds = 1296000000;
const monthInBlocks = 4380;

@Resolver()
export class HealthResolver {
  constructor(
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => ChannelsFeeHealth)
  async getFeeHealth(@CurrentUser() user: UserId) {
    const { public_key } = await this.nodeService.getWalletInfo(user.id);
    const { channels } = await this.nodeService.getChannels(user.id);

    const getChannelList = () =>
      Promise.all(
        channels
          .map(async channel => {
            const { id, partner_public_key: publicKey } = channel;
            const [channelInfo, channelError] = await toWithError(
              this.nodeService.getChannel(user.id, id)
            );

            if (channelError || !channelInfo) {
              this.logger.debug(`Error getting channel with id ${id}`, {
                error: channelError,
              });
              return null;
            }

            const policies = channelInfo.policies;

            let partnerBaseFee = 0;
            let partnerFeeRate = 0;
            let myBaseFee = 0;
            let myFeeRate = 0;

            if (!channelError && policies) {
              for (let i = 0; i < policies.length; i++) {
                const policy = policies[i];

                if (policy.public_key === public_key) {
                  myBaseFee = Number(policy.base_fee_mtokens) || 0;
                  myFeeRate = policy.fee_rate || 0;
                } else {
                  partnerBaseFee = Number(policy.base_fee_mtokens) || 0;
                  partnerFeeRate = policy.fee_rate || 0;
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

    const health = (list as ChannelFeesType[]).map(
      (channel: ChannelFeesType) => {
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

        const partnerSide = {
          score: partnerScore,
          rate: channel.partnerFeeRate,
          base: Math.round(channel.partnerBaseFee / 1000),
          rateScore: partnerRateScore,
          baseScore: partnerBaseScore,
          rateOver: true,
          baseOver: true,
        };

        return {
          id: channel.id,
          partnerSide,
          mySide,
          partner: { publicKey: channel.publicKey },
        };
      }
    );

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
  }

  @Query(() => ChannelsTimeHealth)
  async getTimeHealth(@CurrentUser() user: UserId) {
    const { channels } = await this.nodeService.getChannels(user.id);

    const health = channels.map(channel => {
      const {
        time_offline = 1,
        time_online = 1,
        id,
        partner_public_key,
      } = channel;

      const significant = time_offline + time_online > halfMonthInMilliSeconds;

      const defaultProps = {
        id,
        significant,
        monitoredTime: Math.round((time_online + time_offline) / 1000),
        monitoredUptime: Math.round(time_online / 1000),
        monitoredDowntime: Math.round(time_offline / 1000),
        partner: { publicKey: partner_public_key },
      };

      const percentOnline = time_online / (time_online + time_offline);

      return {
        score: Math.round(percentOnline * 100),
        ...defaultProps,
      };
    });

    const average = Math.round(getAverage(health.map(c => c.score)));

    return {
      score: average,
      channels: health,
    };
  }

  @Query(() => ChannelsHealth)
  async getVolumeHealth(@CurrentUser() user: UserId) {
    const before = new Date().toISOString();
    const after = subMonths(new Date(), 1).toISOString();

    const { current_block_height } = await this.nodeService.getWalletInfo(
      user.id
    );
    const { channels } = await this.nodeService.getChannels(user.id);
    const { forwards } = await this.nodeService.getForwards(user.id, {
      after,
      before,
    });

    const channelVolume: { channel: string; tokens: number }[] =
      getChannelVolume(forwards);

    const channelDetails = channels
      .map(channel => {
        const { tokens } = channelVolume.find(
          c => c.channel === channel.id
        ) || {
          tokens: 0,
        };
        const info = getChannelIdInfo(channel.id);

        if (!info) return;

        const age = Math.min(
          current_block_height - info.blockHeight,
          monthInBlocks
        );

        return {
          id: channel.id,
          volume: tokens,
          volumeNormalized: Math.round(tokens / age) || 0,
          publicKey: channel.partner_public_key,
        };
      })
      .filter(Boolean);

    const average = getAverage(
      channelDetails.map(c => c?.volumeNormalized || 0)
    );

    const health = channelDetails
      .map(channel => {
        if (!channel) return null;
        const diff = (channel.volumeNormalized - average) / average || -1;
        const score = Math.round((diff + 1) * 100);

        return {
          id: channel.id,
          score,
          volumeNormalized: channel.volumeNormalized,
          averageVolumeNormalized: average,
          partner: { publicKey: channel.publicKey },
        };
      })
      .filter(Boolean);

    const globalAverage = Math.round(
      getAverage(health.map(c => Math.min(c?.score || 0, 100)))
    );

    return { score: globalAverage, channels: health };
  }
}
