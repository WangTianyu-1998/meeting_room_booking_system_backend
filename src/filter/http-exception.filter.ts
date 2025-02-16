// src/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseUtil } from 'src/utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = '请求失败';
    if (typeof exceptionResponse === 'object' && exceptionResponse['message']) {
      // 如果 message 是数组，只取第一个错误信息
      if (Array.isArray(exceptionResponse['message'])) {
        message = exceptionResponse['message'].join(', ');
      } else {
        message = exceptionResponse['message'];
      }
    }
    response.status(status).json(ResponseUtil.error(status, message));
  }
}
