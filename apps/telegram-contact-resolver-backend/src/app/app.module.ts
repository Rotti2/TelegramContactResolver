import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './shared/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { importEntitites } from './entities-import';
import { importMigrations } from './migrations-import';
import { GroupEventScheduleModule } from './schedule/group-event-schedule.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TelegramModule,
    ConfigModule.forRoot({
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        entities: importEntitites(),
        migrations: importMigrations(),
        migrationsRun: true
      }),
      inject: [ConfigService]
    }),
    GroupEventScheduleModule,
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
