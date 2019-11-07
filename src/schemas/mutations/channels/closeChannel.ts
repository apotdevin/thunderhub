import { closeChannel as lnCloseChannel } from "ln-service";
import { logger } from "../../../helpers/logger";
import { requestLimiter } from "../../../helpers/rateLimiter";
import { GraphQLBoolean, GraphQLString } from "graphql";
import { CloseChannelType } from "../../../schemaTypes/mutation.ts/channels/closeChannel";

interface CloseChannelProps {
  transaction_id: string;
  transaction_vout: string;
}

export const closeChannel = {
  type: CloseChannelType,
  args: {
    forceClose: {
      type: GraphQLBoolean
    },
    id: {
      type: GraphQLString
    },
    transactionId: {
      type: GraphQLString
    },
    transactionOutput: {
      type: GraphQLString
    }
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "closeChannel", 1, "1s");
    const { lnd } = context;

    if (!params.id && !params.transactionId && !params.transactionOutput)
      throw new Error(
        "Id, transaction id or transaction output index are required"
      );

    try {
      const info: CloseChannelProps = await lnCloseChannel({
        lnd: lnd,
        id: params.id,
        is_force_close: params.forceClose,
        transaction_id: params.transactionId
      });
      return {
        transactionId: info.transaction_id,
        transactionOutputIndex: info.transaction_vout
      };
    } catch (error) {
      logger.error("Error closing channel: %o", error);
      throw new Error("Failed to close channel.");
    }
  }
};
