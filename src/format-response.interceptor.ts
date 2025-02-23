import {
  CallHandler,
  ExecutionContext,
  HttpCode,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

/**
 * 响应成功拦截器
 * 把响应的格式改成 {code、message、data}
 */
@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      // 通过 rxjs 工具 将数据进行格式化
      map((data) => ({
        code: request.statusCode ?? HttpStatus.OK,
        message: 'success',
        data,
      })),
    );
  }
}
