import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import { AuthenticationModule } from './modules/security/security.module';
import { FilesModule } from './modules/files/files.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { NodeModule } from './modules/node/node.module';
import { ApiModule } from './modules/api/api.module';
import { getAuthToken } from './utils/request';
import { FetchModule } from './modules/fetch/fetch.module';
import { appConstants } from './utils/appConstants';
import { transports, format } from 'winston';
import configuration from './config/configuration';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { WsModule } from './modules/ws/ws.module';
import { SubModule } from './modules/sub/sub.module';
import { ClientConfigModule } from './modules/clientConfig/clientConfig.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import {
  DataloaderService,
  DataloaderTypes,
} from './modules/dataloader/dataloader.service';
import { DataloaderModule } from './modules/dataloader/dataloader.module';

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
    ClientConfigModule,
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
          } catch (error) {
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
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: join(__dirname, '..', '..', 'src', 'client', 'dist'),
          serveRoot: config.get('basePath') || '/',
          exclude: [
            `${config.get('basePath') || ''}/graphql*`,
            `${config.get('basePath') || ''}/socket.io*`,
            `${config.get('basePath') || ''}/api*`,
          ],
        },
      ],
    }),
  ],
})
export class AppModule {}
