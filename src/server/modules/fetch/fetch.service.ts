import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { Agent } from 'https';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { DocumentNode, GraphQLError, print } from 'graphql';

@Injectable()
export class FetchService {
  agent: Agent | null = null;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    const torProxy = this.configService.get('torProxy');

    if (torProxy) {
      this.logger.info(`Using tor proxy for external requests: ${torProxy}`);
      this.agent = new SocksProxyAgent(torProxy) as any;
    }
  }

  async fetchWithProxy(url: string, options?: any) {
    return this.agent
      ? fetch(url, { agent: this.agent, ...options })
      : fetch(url, options);
  }

  async graphqlFetchWithProxy(
    url: string,
    query: DocumentNode,
    variables?: { [key: string]: string | number | string[] | boolean },
    headers?: { [key: string]: string | number | string[] | boolean }
  ): Promise<{
    data: any;
    error: undefined | GraphQLError;
  }> {
    return this.fetchWithProxy(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      body: JSON.stringify({ query: print(query), variables }),
    })
      .then(res => res.json() as any)
      .then(result => {
        const { data, errors } = result;
        return {
          data,
          error: errors?.[0]?.message,
        };
      })
      .catch(error => {
        this.logger.error('Error doing graphql fetch', { error });
        return { data: undefined, error };
      });
  }
}
