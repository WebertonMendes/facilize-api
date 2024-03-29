import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const DATABASE_TYPE = 'mysql';

export default new DataSource({
  type: DATABASE_TYPE,
  host: configService.get('TYPEORM_HOST'),
  port: parseInt(configService.get('TYPEORM_PORT')),
  username: configService.get('TYPEORM_USERNAME'),
  password: configService.get('TYPEORM_PASSWORD'),
  database: configService.get('TYPEORM_DATABASE'),
  entities: [configService.get('TYPEORM_ENTITIES')],
  migrations: [configService.get('TYPEORM_MIGRATIONS')],
  synchronize: false,
});

export const ConfigDatabase: TypeOrmModuleOptions = {
  type: DATABASE_TYPE,
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [process.env.TYPEORM_ENTITIES],
  migrations: [process.env.TYPEORM_MIGRATIONS],
  synchronize: false,
};
