import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export class UnLoginException {
  message: string;
  constructor(message?) {
    this.message = message;
  }
}

/**
 * 过滤器 - Jwt过期的返回格式
 */
@Catch(UnLoginException)
export class UnLoginFilter<T> implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.json({
      code: HttpStatus.UNAUTHORIZED,
      message: 'fail',
      data: exception.message ?? '用户未登录',
    });
  }
}
