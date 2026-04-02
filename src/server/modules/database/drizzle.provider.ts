import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import { migrate as migrateSqlite } from 'drizzle-orm/better-sqlite3/migrator';
import { migrate as migratePg } from 'drizzle-orm/postgres-js/migrator';
import Database from 'better-sqlite3';
import postgres from 'postgres';
import { join } from 'path';
import * as sqliteSchema from './schema/sqlite';
import * as pgSchema from './schema/pg';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB =
  | ReturnType<typeof drizzleSqlite>
  | ReturnType<typeof drizzlePg>;

export type DbSchema = typeof sqliteSchema | typeof pgSchema;

export type DrizzleProvider = {
  db: DrizzleDB;
  schema: DbSchema;
} | null;

const logger = new Logger('DatabaseProvider');

export const drizzleProvider: FactoryProvider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<DrizzleProvider> => {
    const dbType = config.get<string>('database.type');

    if (!dbType) return null;

    const migrationsRoot = join(process.cwd(), 'drizzle');

    if (dbType === 'postgres') {
      const url = config.get<string>('database.url');
      if (!url) {
        throw new Error('DB_POSTGRES_URL is required when DB_TYPE is postgres');
      }
      const db = drizzlePg(postgres(url));
      logger.log('Running PostgreSQL migrations...');
      await migratePg(db, {
        migrationsFolder: join(migrationsRoot, 'pg'),
      });
      logger.log('PostgreSQL migrations complete.');
      return { db, schema: pgSchema };
    }

    if (dbType === 'sqlite') {
      const path = config.get<string>('database.path');
      if (!path) {
        throw new Error('DB_SQLITE_PATH is required when DB_TYPE is sqlite');
      }
      const db = drizzleSqlite(new Database(path));
      logger.log('Running SQLite migrations...');
      migrateSqlite(db, {
        migrationsFolder: join(migrationsRoot, 'sqlite'),
      });
      logger.log('SQLite migrations complete.');
      return { db, schema: sqliteSchema };
    }

    throw new Error(`Unsupported DB_TYPE: ${dbType}`);
  },
};
