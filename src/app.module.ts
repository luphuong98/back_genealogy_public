import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/v1/modules/user/user.module';
import { AuthenticationModule } from './api/v1/modules/authentication/authentication.module';
import { PersonModule } from './api/v1/modules/person/person.module';
import { ConfigModule } from '@nestjs/config';
import { database_config } from './config/database/database.config';
import { DBValidationModule } from './config/database/db-validation.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [database_config],
      cache: true,
      expandVariables: true,
    }),
    AuthenticationModule,
    UserModule,
    PersonModule,
    DBValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
