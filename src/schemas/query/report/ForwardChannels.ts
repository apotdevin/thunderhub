import { GraphQLString, GraphQLNonNull } from "graphql";
import { getForwards as getLnForwards } from "ln-service";
import { logger } from "../../../helpers/logger";
import { requestLimiter } from "../../../helpers/rateLimiter";
import { subHours, subDays } from "date-fns";
import { countArray } from "./Helpers";
import { ForwardCompleteProps } from "./ForwardReport.interface";
import { ForwardChannelsType } from "../../../schemaTypes/query/report/ForwardChannels";
import { sortBy } from "underscore";
import { getAuthLnd } from "../../../helpers/helpers";

export const getForwardChannelsReport = {
  type: ForwardChannelsType,
  args: {
    auth: { type: new GraphQLNonNull(GraphQLString) },
    time: { type: GraphQLString },
    order: { type: GraphQLString }
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(
      context.ip,
      params,
      "getForwardChannelsReport",
      1,
      "1s"
    );

    const lnd = getAuthLnd(params.auth);

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

      const sortedInCount = sortBy(incomingCount, params.order)
        .reverse()
        .slice(0, 5);
      const sortedOutCount = sortBy(outgoingCount, params.order)
        .reverse()
        .slice(0, 5);

      return {
        incoming: JSON.stringify(sortedInCount),
        outgoing: JSON.stringify(sortedOutCount)
      };
    } catch (error) {
      logger.error("Error getting forward channel report: %o", error);
      throw new Error("Failed to get forward channel report.");
    }
  }
};
