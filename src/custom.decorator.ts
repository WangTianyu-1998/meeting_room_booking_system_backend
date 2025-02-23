import {
  createParamDecorator,
  SetMetadata,
  ExecutionContext,
} from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Request } from 'express';

/**
 * 登录鉴权 自定义装饰器
 * @returns
 */
export const RequireLogin = () => SetMetadata('require-login', true);

/**
 * 接口访问鉴权 自定义装饰器
 * @param permissions
 * @returns
 */
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);

/**
 * 获取user信息传入handler
 * 传入属性名的是偶,返回对于的属性值,否则返回全部的user信息
 */
export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
