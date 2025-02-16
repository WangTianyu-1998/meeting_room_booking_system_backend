import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. 全局增加校验
  app.useGlobalPipes(new ValidationPipe());
  // 2. 全局统一返回格式
  app.useGlobalFilters(new HttpExceptionFilter());
  // 3. 读取全局在.env中放置的配置
  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port') ?? 333);
}
void bootstrap();
