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
import { transports, format } from 'winston';
import configuration from './config/configuration';
import jwt from 'jsonwebtoken';
import { SseModule } from './modules/sse/sse.module';
import { SubModule } from './modules/sub/sub.module';
import { ClientConfigModule } from './modules/clientConfig/clientConfig.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import {
  DataloaderService,
  DataloaderTypes,
} from './modules/dataloader/dataloader.service';
import { DataloaderModule } from './modules/dataloader/dataloader.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';

const { combine, timestamp, prettyPrint, json } = format;

export type ContextType = {
  req: any;
  res: any;
  authToken?: JwtObjectType;
  loaders: DataloaderTypes;
  nodeSlug?: string;
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
    SseModule,
    ClientConfigModule,
    ApiModule,
    NodeModule,
    AuthenticationModule,
    FilesModule,
    AccountsModule,
    FetchModule,
    DatabaseModule,
    UserModule,
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
          origin: config.get('isProduction') ? false : true,
          credentials: true,
        },
        path: `${config.get('basePath')}/graphql`,
        context: ({ req, res }): ContextType => {
          const token = getAuthToken(req);

          const nodeSlug = (req.headers['x-node-slug'] as string) || undefined;

          const loaders = dataloaderService.createLoaders();

          const context = {
            req,
            res,
            loaders,
            nodeSlug,
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
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: join(process.cwd(), 'src', 'client', 'dist'),
          serveRoot: config.get('basePath'),
          exclude: [
            `${config.get('basePath') || ''}/graphql{*path}`,
            `${config.get('basePath') || ''}/api{*path}`,
          ],
        },
      ],
    }),
  ],
})
export class AppModule {}
