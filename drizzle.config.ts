import { defineConfig } from 'drizzle-kit';

const dbType = process.env.DB_TYPE || 'sqlite';

export default dbType === 'postgres'
  ? defineConfig({
      schema: './src/server/modules/database/schema/pg/*',
      out: './drizzle/pg',
      dialect: 'postgresql',
    })
  : defineConfig({
      schema: './src/server/modules/database/schema/sqlite/*',
      out: './drizzle/sqlite',
      dialect: 'sqlite',
    });
