import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { gql } from 'graphql-tag';
import { FetchService } from '../../fetch/fetch.service';
import { BaseInvoice, BaseNode, BasePoints } from './base.types';
import { GraphQLError } from 'graphql';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

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
  constructor(
    private configService: ConfigService,
    private fetchService: FetchService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => Boolean)
  async getBaseCanConnect() {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      this.configService.get('urls.tbase'),
      getBaseCanConnectQuery
    );

    if (error || !data?.hello) return false;

    return true;
  }

  @Query(() => [BaseNode])
  async getBaseNodes() {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      this.configService.get('urls.tbase'),
      getBaseNodesQuery
    );

    if (error || !data?.getNodes) return [];

    return data.getNodes.filter(
      (n: { public_key: string; socket: string }) => n.public_key && n.socket
    );
  }

  @Query(() => [BasePoints])
  async getBasePoints() {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      this.configService.get('urls.tbase'),
      getBasePointsQuery
    );

    if (error || !data?.getPoints) return [];

    return data.getPoints;
  }

  @Mutation(() => BaseInvoice)
  async createBaseInvoice(@Args('amount') amount: number) {
    if (!amount) {
      throw new GraphQLError('No amount provided for donation invoice.');
    }

    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      this.configService.get('urls.tbase'),
      createBaseInvoiceQuery,
      { amount }
    );

    if (error || !data?.createInvoice) {
      this.logger.error('Error getting donation invoice.', { error, data });
      throw new GraphQLError('Error creating donation invoice.');
    }

    return data.createInvoice;
  }

  @Mutation(() => Boolean)
  async createThunderPoints(
    @Args('id') id: string,
    @Args('alias') alias: string,
    @Args('uris', { type: () => [String] }) uris: string[],
    @Args('public_key') public_key: string
  ) {
    const { data, error } = await this.fetchService.graphqlFetchWithProxy<any>(
      this.configService.get('urls.tbase'),
      createThunderPointsQuery,
      { id, alias, uris, public_key }
    );

    if (error || !data?.createPoints) return false;

    return true;
  }
}
