import { GraphQLString } from "graphql";
import { getForwards as getLnForwards } from "ln-service";
import { logger } from "../../../helpers/logger";
import { requestLimiter } from "../../../helpers/rateLimiter";
import { subHours, subDays } from "date-fns";
import { countArray } from "./Helpers";
import { ForwardCompleteProps } from "./ForwardReport.interface";
import { ForwardChannelsType } from "../../../schemaTypes/query/report/ForwardChannels";

export const getForwardChannelsReport = {
  type: ForwardChannelsType,
  args: {
    time: {
      type: GraphQLString
    }
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(
      context.ip,
      params,
      "getForwardChannelsReport",
      1,
      "1s"
    );
    const { lnd } = context;

    let startDate = new Date();
    const endDate = new Date();

    if (params.time === "month") {
      startDate = subDays(endDate, 30);
    } else if (params.time === "week") {
      startDate = subDays(endDate, 7);
    } else {
      startDate = subHours(endDate, 24);
    }

    try {
      const forwardsList: ForwardCompleteProps = await getLnForwards({
        lnd: lnd,
        after: startDate,
        before: endDate,
        limit: 10000
      });

      const incomingCount = countArray(forwardsList.forwards, true);
      const outgoingCount = countArray(forwardsList.forwards, false);

      return {
        incoming: JSON.stringify(incomingCount),
        outgoing: JSON.stringify(outgoingCount)
      };
    } catch (error) {
      logger.error("Error getting forward channel report: %o", error);
      throw new Error("Failed to get forward channel report.");
    }
  }
};
