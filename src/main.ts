import { ApolloServer } from "apollo-server";
import { thunderHubSchema } from "./schemas";
import { logger } from "./helpers/logger";
import { getIp } from "./helpers/helpers";
import depthLimit from "graphql-depth-limit";

const server = new ApolloServer({
  schema: thunderHubSchema,
  context: async ({ req }: any) => {
    const ip = getIp(req);
    return { ip };
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
