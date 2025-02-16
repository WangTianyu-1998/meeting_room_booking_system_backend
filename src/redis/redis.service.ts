import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClint: RedisClientType;

  async get(key: string) {
    return await this.redisClint.get(key);
  }

  /**
   * @param key key
   * @param value value
   * @param ttl 过期时间
   */
  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClint.set(key, value);

    if (ttl) {
      await this.redisClint.expire(key, ttl);
    }
  }
}
