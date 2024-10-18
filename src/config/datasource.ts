import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'db.ukrpjrlzpkkbdpunnsow.supabase.co',
  port: 5432,
  username: 'postgres',
  password: 'Night-out@2023',
  database: 'postgres',
  entities: ['dist/**/**/*.entity{.ts,.js}'],
  ssl: false,
  migrations: [__dirname + '/../db/*{.ts,.js}'],
  logger: 'advanced-console',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  logging: ['error', 'warn', 'log', 'migration', 'query'],
});

// migrations: [__dirname + '/../db/*{.ts,.js}'],
// "migration:generate": "npx typeorm-ts-node-commonjs migration:generate ./src/db/migrations/ -d ./src/config/datasource.ts",
// "migration:run": "npx typeorm-ts-node-commonjs migration:run -d ./src/config/datasource.ts",
