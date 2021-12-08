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
import configuration from './config/configuration';
import winston from 'winston';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

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
    ApiModule,
    ViewModule,
    NodeModule,
    AuthenticationModule,
    FilesModule,
    AccountsModule,
    FetchModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRootAsync({
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
        transports: [new winston.transports.Console()],
      }),
    }),
  ],
})
export class AppModule {}
