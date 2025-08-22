import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

import configuration from './config/configuration';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ApiModule } from './modules/api/api.module';
import { DataloaderModule } from './modules/dataloader/dataloader.module';
import {
  DataloaderService,
  DataloaderTypes,
} from './modules/dataloader/dataloader.service';
import { FetchModule } from './modules/fetch/fetch.module';
import { FilesModule } from './modules/files/files.module';
import { NodeModule } from './modules/node/node.module';
import { AuthenticationModule } from './modules/security/security.module';
import { SubModule } from './modules/sub/sub.module';
import { ViewModule } from './modules/view/view.module';
import { WsModule } from './modules/ws/ws.module';
import { appConstants } from './utils/appConstants';
import { getAuthToken } from './utils/request';

const { combine, timestamp, prettyPrint, json } = format;

export type ContextType = {
  req: any;
  res: any;
  authToken?: JwtObjectType;
  lnMarketsAuth: string | null;
  tokenAuth: string | null;
  ambossAuth: string | null;
  loaders: DataloaderTypes;
};

export type JwtObjectType = {
  iat: number;
  exp: number;
  iss: string;
  sub: string;
};

@Module({
  imports: [
    AuthenticationModule,
    SubModule,
    WsModule,
    ApiModule,
    NodeModule,
    AuthenticationModule,
    FilesModule,
    AccountsModule,
    FetchModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      inject: [ConfigService, DataloaderService],
      useFactory: (
        config: ConfigService,
        dataloaderService: DataloaderService
      ) => ({
        autoSchemaFile: config.get('isProduction') ? true : 'schema.gql',
        sortSchema: true,
        playground: config.get('playground'),
        introspection: config.get('playground'),
        cors: {
          origin: true,
          credentials: true,
        },
        path: `${config.get('basePath')}/graphql`,
        context: ({ req, res }): ContextType => {
          const cookies = cookie.parse(req.headers.cookie ?? '') || {};

          const token = getAuthToken(req);

          const lnMarketsAuth = cookies[appConstants.lnMarketsAuth];
          const tokenAuth = cookies[appConstants.tokenCookieName];
          const ambossAuth = cookies[appConstants.ambossCookieName];

          const loaders = dataloaderService.createLoaders();

          const context = {
            req,
            res,
            lnMarketsAuth,
            tokenAuth,
            ambossAuth,
            loaders,
          };

          if (!token) return context;

          const secret = config.get('jwtSecret');
          try {
            const authToken = jwt.verify(token, secret) as JwtObjectType;
            return {
              ...context,
              authToken,
            };
          } catch {
            return context;
          }
        },
      }),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        level: config.get('logLevel'),
        transports: [new transports.Console()],
        format: config.get('logJson')
          ? combine(timestamp(), json())
          : combine(timestamp(), prettyPrint()),
      }),
    }),
    // ViewModule has to be the last because of the wildcard controller
    ViewModule,
  ],
})
export class AppModule {}
