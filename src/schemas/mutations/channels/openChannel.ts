import { openChannel as lnOpenChannel } from "ln-service";
import { logger } from "../../../helpers/logger";
import { requestLimiter } from "../../../helpers/rateLimiter";
import { GraphQLBoolean, GraphQLString, GraphQLInt } from "graphql";
import { OpenChannelType } from "../../../schemaTypes/mutation.ts/channels/openChannel";

interface OpenChannelProps {
  transaction_id: string;
  transaction_vout: string;
}

export const openChannel = {
  type: OpenChannelType,
  args: {
    isPrivate: {
      type: GraphQLBoolean
    },
    amount: {
      type: GraphQLInt
    },
    partnerPublicKey: {
      type: GraphQLString
    }
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "openChannel", 1, "1s");
    const { lnd } = context;

    if (!params.amount || !params.partnerPublicKey)
      throw new Error("Amount and partner public key are required");

    try {
      const info: OpenChannelProps = await lnOpenChannel({
        lnd: lnd,
        is_private: params.isPrivate,
        local_tokens: params.amount,
        partner_public_key: params.partnerPublicKey
      });
      return {
        transactionId: info.transaction_id,
        transactionOutputIndex: info.transaction_vout
      };
    } catch (error) {
      logger.error("Error opening channel: %o", error);
      throw new Error("Failed to open channel.");
    }
  }
};
