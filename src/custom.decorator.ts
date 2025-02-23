import { SetMetadata } from '@nestjs/common';

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
