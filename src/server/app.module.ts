import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ViewModule } from './modules/view/view.module';
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
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';

const { combine, timestamp, prettyPrint, json } = format;

export type ContextType = {
  req: any;
  res: any;
  authToken?: JwtObjectType;
  lnMarketsAuth: string | null;
  tokenAuth: string | null;
  ambossAuth: string | null;
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
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        autoSchemaFile: 'schema.gql',
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

          const context = {
            req,
            res,
            lnMarketsAuth,
            tokenAuth,
            ambossAuth,
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
    // ViewModule has to be the last because of the wildcard controller
    ViewModule,
  ],
})
export class AppModule {}
