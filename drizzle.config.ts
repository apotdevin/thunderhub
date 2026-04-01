import { defineConfig } from 'drizzle-kit';

const dbType = process.env.DB_TYPE || 'sqlite';

export default dbType === 'postgres'
  ? defineConfig({
      schema: './src/server/modules/database/schema/*',
      out: './drizzle',
      dialect: 'postgresql',
      dbCredentials: {
        url: process.env.DB_POSTGRES_URL!,
      },
    })
  : defineConfig({
      schema: './src/server/modules/database/schema/*',
      out: './drizzle',
      dialect: 'sqlite',
      dbCredentials: {
        url: process.env.DB_SQLITE_PATH!,
      },
    });
