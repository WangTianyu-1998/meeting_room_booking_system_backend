import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserPasswordDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码不能少于6位' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '不是合法的邮箱格式' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}
