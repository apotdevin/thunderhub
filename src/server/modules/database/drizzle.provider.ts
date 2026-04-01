import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import Database from 'better-sqlite3';
import postgres from 'postgres';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB =
  | ReturnType<typeof drizzleSqlite>
  | ReturnType<typeof drizzlePg>
  | null;

export const DrizzleProvider: FactoryProvider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: (config: ConfigService): DrizzleDB => {
    const dbType = config.get<string>('database.type');

    if (!dbType) return null;

    if (dbType === 'postgres') {
      const url = config.get<string>('database.url');
      if (!url) {
        throw new Error('DB_POSTGRES_URL is required when DB_TYPE is postgres');
      }
      return drizzlePg(postgres(url));
    }

    if (dbType === 'sqlite') {
      const path = config.get<string>('database.path');
      if (!path) {
        throw new Error('DB_SQLITE_PATH is required when DB_TYPE is sqlite');
      }
      return drizzleSqlite(new Database(path));
    }

    throw new Error(`Unsupported DB_TYPE: ${dbType}`);
  },
};
