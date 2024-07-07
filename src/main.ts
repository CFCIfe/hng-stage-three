import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.map(
          (error) => (
            console.log(error),
            {
              field: error.property,
              message: Object.values(error.constraints).join(', '),
            }
          ),
        );
        return new HttpException(
          { errors: formattedErrors },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    }),
  );
  await app.listen(9000);
}
bootstrap();
