import * as crypto from 'crypto';

export function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export class ResponseUtil {
  static success(message: string, data?: any) {
    return {
      code: 200,
      message,
      status: 'success',
      data,
    };
  }

  static error(code: number, message: string) {
    return {
      code,
      message,
      status: 'error',
    };
  }
}
