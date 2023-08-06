import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        // JWT_TOKEN_SECRET: Joi.string().required(),
        // JWT_EXPIRATION_TIME: Joi.string().required(),
        // JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        // JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        // EMAIL_CONFIRMATION_URL: Joi.string().required(),
        // EMAIL_HOST: Joi.string().required(),
        // EMAIL_USER: Joi.string().required(),
        // EMAIL_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_URI: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
})
export class DBValidationModule {}
