import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { gql } from 'graphql-tag';
import { appUrls } from 'src/server/utils/appUrls';
import { FetchService } from '../../fetch/fetch.service';
import { BaseInvoice, BaseNode, BasePoints } from './base.types';

const getBaseCanConnectQuery = gql`
  {
    hello
  }
`;

const getBaseNodesQuery = gql`
  {
    getNodes {
      _id
      name
      public_key
      socket
    }
  }
`;

const getBasePointsQuery = gql`
  {
    getPoints {
      alias
      amount
    }
  }
`;

const createBaseInvoiceQuery = gql`
  mutation CreateInvoice($amount: Int!) {
    createInvoice(amount: $amount) {
      request
      id
    }
  }
`;

const createThunderPointsQuery = gql`
  mutation CreatePoints(
    $id: String!
    $alias: String!
    $uris: [String!]!
    $public_key: String!
  ) {
    createPoints(id: $id, alias: $alias, uris: $uris, public_key: $public_key)
  }
`;

@Resolver()
export class BaseResolver {
  constructor(private fetchService: FetchService) {}

  @Query(() => Boolean)
  async getBaseCanConnect() {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      appUrls.tbase,
      getBaseCanConnectQuery
    );

    if (error || !data?.hello) return false;

    return true;
  }

  @Query(() => [BaseNode])
  async getBaseNodes() {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      appUrls.tbase,
      getBaseNodesQuery
    );

    if (error || !data?.getNodes) return [];

    return data.getNodes.filter(
      (n: { public_key: string; socket: string }) => n.public_key && n.socket
    );
  }

  @Query(() => [BasePoints])
  async getBasePoints() {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      appUrls.tbase,
      getBasePointsQuery
    );

    if (error || !data?.getPoints) return [];

    return data.getPoints;
  }

  @Mutation(() => BaseInvoice)
  async createBaseInvoice(@Args('amount') amount: number) {
    if (!amount) return '';

    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      appUrls.tbase,
      createBaseInvoiceQuery,
      { amount }
    );

    if (error) return null;
    if (data?.createInvoice) return data.createInvoice;

    return null;
  }

  @Mutation(() => Boolean)
  async createThunderPoints(
    @Args('id') id: string,
    @Args('alias') alias: string,
    @Args('uris', { type: () => [String] }) uris: string[],
    @Args('public_key') public_key: string
  ) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy(
      appUrls.tbase,
      createThunderPointsQuery,
      { id, alias, uris, public_key }
    );

    if (error || !data?.createPoints) return false;

    return true;
  }
}
