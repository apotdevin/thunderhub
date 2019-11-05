import { ApolloServer } from "apollo-server";
import { thunderHubSchema } from "./schemas";
import { logger } from "./helpers/logger";
import { getIp } from "./helpers/helpers";
import depthLimit from "graphql-depth-limit";
import lnService from "ln-service";

const { lnd } = lnService.authenticatedLndGrpc({
  macaroon: process.env.LND_MAC,
  socket: process.env.LND_IP
});
logger.info("Connection established with gRPC");

lnService.getWalletInfo({ lnd }, (error: any, result: any) => {
  logger.info(`Connected to node: ${result.alias}`);
  if (error) logger.error(`Error connecting to node: ${error}`);
});

const server = new ApolloServer({
  schema: thunderHubSchema,
  context: async ({ req }: any) => {
    const ip = getIp(req);
    return { ip, lnd };
  },
  validationRules: [
    depthLimit(2, { ignore: [/_trusted$/, "idontcare", "whatever"] })
  ]
});

server.listen({ port: process.env.PORT || 3001 }).then(({ url }: any) => {
  logger.info(`Server ready at ${url}`);
});

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}
