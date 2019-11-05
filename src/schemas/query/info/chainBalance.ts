import { getChainBalance } from "ln-service";
import { logger } from "../../../helpers/logger";
import { GraphQLInt } from "graphql";
import { requestLimiter } from "../../../helpers/rateLimiter";

interface ChainBalanceProps {
  chain_balance: number;
}

export const chainBalance = {
  type: GraphQLInt,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, params, "chainBalance", 1, "1s");
    const { lnd } = context;

    try {
      const chainBalance: ChainBalanceProps = await getChainBalance({
        lnd: lnd
      });
      return chainBalance.chain_balance;
    } catch (error) {
      logger.error("Error getting chain balance: %o", error);
      throw new Error("Failed to get chain balance.");
    }
  }
};
