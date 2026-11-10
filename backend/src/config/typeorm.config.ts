import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.getOrThrow<string>('DB_HOST'),
  port: Number(config.get('DB_PORT') ?? 5432),
  username: config.getOrThrow<string>('DB_USERNAME'),
  password: config.getOrThrow<string>('DB_PASSWORD'),
  database: config.get<string>('DB_NAME') ?? 'postgres',
  autoLoadEntities: true,
  synchronize: false, // las tablas ya existen en Supabase
  uuidExtension: 'pgcrypto',
  ssl: { rejectUnauthorized: false },
  extra: {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
  retryAttempts: 3,
  retryDelay: 3000,
});
