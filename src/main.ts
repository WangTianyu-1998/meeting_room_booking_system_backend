import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { UnLoginFilter } from './unlogin.filter';
import { CustomExceptionFilter } from './custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  // 1. 全局增加校验
  app.useGlobalPipes(new ValidationPipe());
  // 2. 全局拦截器-统一返回格式
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // 3. 全局拦截器 记录日志
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // 4. 全局过滤器 统一Jwt登录过期的返回格式
  app.useGlobalFilters(new UnLoginFilter());
  // 5. 全局过滤器 统一HttpException错误返回的格式
  app.useGlobalFilters(new CustomExceptionFilter());
  // 6. 生成接口文档
  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的验证',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  // 7. 读取全局在.env中放置的配置
  const configService = app.get(ConfigService);
  // 8. 静态资源

  // 9. 跨域
  app.enableCors();
  console.log(
    'redis_server_host------,',
    configService.get('redis_server_host'),
  );
  await app.listen(configService.get('nest_server_port') ?? 333);
}
void bootstrap();
