import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transforms/transform.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://hasanchezshadow.github.io',
      'https://task-management-frontend-4lvx.onrender.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });
  // app.useLogger(logger);
  const port = process.env.APP_PORT;
  await app.listen(port);
  logger.log(`App is running on port ${port}`);
}
bootstrap();
