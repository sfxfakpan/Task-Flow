import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  environment: {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    autoLoadEntities: process.env.DATABASE_AUTOLOAD_ENTITIES,
    sync: process.env.DATABASE_SYNC
  },
  
}));
