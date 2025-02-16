import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { ResponseUtil } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  // 注册模块
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  // 发送邮件
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p style="font-size:24;color: orangered; font-weight: 700;">欢迎来到瑜小窝, 你的注册验证码是 ${code}</p>`,
    });
    return ResponseUtil.success('发送成功');
  }
}
