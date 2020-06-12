import {
  createTestClient,
  ApolloServerTestClient,
} from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server';
import schema from 'server/schema';
import { ContextMock } from 'server/utils/testMocks';

export default function testServer(): ApolloServerTestClient {
  return createTestClient(new ApolloServer({ schema, context: ContextMock }));
}
