import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5, ResponseUtil } from 'src/utils';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject(RedisService)
  private redisService: RedisService;

  // 注册
  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      // throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
      return ResponseUtil.error(HttpStatus.BAD_REQUEST, '验证码已失效');
    }

    if (user.captcha !== captcha) {
      // throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
      return ResponseUtil.error(HttpStatus.BAD_REQUEST, '验证码不正确');
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      // throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
      return ResponseUtil.error(HttpStatus.BAD_REQUEST, '用户已存在');
    }

    const newUSer = new User();
    newUSer.username = user.username;
    newUSer.password = md5(user.password);
    newUSer.email = user.email;
    newUSer.nickName = user.nickName;

    try {
      await this.userRepository.save(newUSer);
      return ResponseUtil.success('注册成功');
    } catch (error) {
      this.logger.error(error, UserService);
      return ResponseUtil.error(HttpStatus.INTERNAL_SERVER_ERROR, '注册失败');
    }
  }
}
