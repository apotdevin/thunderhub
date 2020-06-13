import {
  createTestClient,
  ApolloServerTestClient,
} from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server';
import schema from 'server/schema';
import { ContextMock } from 'server/tests/testMocks';

export default function testServer(context?: any): ApolloServerTestClient {
  return createTestClient(
    new ApolloServer({ schema, context: context || ContextMock })
  );
}
