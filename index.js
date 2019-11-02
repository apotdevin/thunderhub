const { ApolloServer } = require("apollo-server");
var { GraphQLSchema } = require("graphql");
var { GraphQLObjectType } = require("graphql");
var { GraphQLString } = require("graphql");

const depthLimit = require("graphql-depth-limit");
const logger = require("./helpers/logger");
const { getIp } = require("./helpers/helpers");
const lnService = require("ln-service");
require("dotenv").config();

const GraphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      success: {
        type: GraphQLString,
        resolve: () => {
          return "It was a success!";
        }
      },
      warning: {
        type: GraphQLString,
        resolve: () => {
          return "You have a warning.";
        }
      },
      error: {
        type: GraphQLString,
        resolve: () => {
          return "Error occurred!";
        }
      }
    }
  })
});

const { lnd } = lnService.authenticatedLndGrpc({
  macaroon: process.env.LND_MAC,
  socket: process.env.LND_IP
});
logger.info("Connection established with gRPC");

lnService.getWalletInfo({ lnd }, (error, result) => {
  logger.info(`Connected to node: ${result.alias}`);
  if (error) logger.error(`Error connecting to node: ${error}`);
});

const server = new ApolloServer({
  schema: GraphqlSchema,
  context: async ({ req }) => {
    const ip = getIp(req);
    return { ip, lnd };
  },
  validationRules: [
    depthLimit(2, { ignore: [/_trusted$/, "idontcare", "whatever"] })
  ]
});

server.listen({ port: process.env.PORT || 3001 }).then(({ url }) => {
  logger.info(`Server ready at ${url}`);
});
