import {
  getChainBalance as getBalance,
  getPendingChainBalance as getPending
} from "ln-service";
import { logger } from "../../../helpers/logger";
import { requestLimiter } from "../../../helpers/rateLimiter";
import { GraphQLInt } from "graphql";

interface ChainBalanceProps {
  chain_balance: number;
}

interface PendingChainBalanceProps {
  pending_chain_balance: number;
}

export const getChainBalance = {
  type: GraphQLInt,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "chainBalance", 1, "1s");
    const { lnd } = context;

    try {
      const value: ChainBalanceProps = await getBalance({
        lnd: lnd
      });
      return value.chain_balance;
    } catch (error) {
      logger.error("Error getting chain balance: %o", error);
      throw new Error("Failed to get chain balance.");
    }
  }
};

export const getPendingChainBalance = {
  type: GraphQLInt,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "pendingChainBalance", 1, "1s");
    const { lnd } = context;

    try {
      const pendingValue: PendingChainBalanceProps = await getPending({
        lnd: lnd
      });
      return pendingValue.pending_chain_balance;
    } catch (error) {
      logger.error("Error getting pending chain balance: %o", error);
      throw new Error("Failed to get pending chain balance.");
    }
  }
};
