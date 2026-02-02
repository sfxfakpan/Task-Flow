import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { appConfig } from '../config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import environmentValidation from '../config/environment.validation';
import { UserModule } from '../modules/user/user.module';
import { BoardModule } from '../modules/board/board.module';
import { AuthModule } from '../modules/auth/auth.module';
import { TaskModule } from '../modules/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: environmentValidation
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.get('app.database');
        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.name,
          autoLoadEntities: db.autoLoadEntities,
          synchronize: false //db.sync,
        };
      },
    }),
    UserModule,
    BoardModule,
    AuthModule,
    TaskModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
