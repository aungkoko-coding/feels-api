import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: process.env.ALLOW_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(3001);
}
bootstrap();
