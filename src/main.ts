import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. 全局增加校验
  app.useGlobalPipes(new ValidationPipe());
  // 2. 全局统一返回格式
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
