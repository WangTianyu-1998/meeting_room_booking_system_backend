import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. 全局增加校验
  app.useGlobalPipes(new ValidationPipe());
  // 2. 全局拦截器-统一返回格式
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // 3. 全局拦截器 记录日志
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // 4. 读取全局在.env中放置的配置
  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port') ?? 333);
}
void bootstrap();
