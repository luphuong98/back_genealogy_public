import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './api/v1/modules/person/person.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { database_config } from './config/database/database.config';
import { DBValidationModule } from './config/database/db-validation.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MarriagePersonModule } from '@modules/marriage_person/marriage-person.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [database_config],
      cache: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const database = configService.get('DB_NAME');
        const host = configService.get('DB_URI');
        return {
          uri: host,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    PersonModule,
    DBValidationModule,
    MarriagePersonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
