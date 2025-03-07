import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListVo } from './vo/user-list.vo';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject(RedisService)
  private redisService: RedisService;

  async initData() {
    const user1 = new User();
    user1.username = 'zhangsan';
    user1.password = md5('111111');
    user1.email = 'xxx@xx.com';
    user1.isAdmin = true;
    user1.nickName = '张三';
    user1.phoneNumber = '13233323333';

    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5('222222');
    user2.email = 'yy@yy.com';
    user2.nickName = '李四';

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  // 注册
  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
      // return ResponseUtil.error(HttpStatus.BAD_REQUEST, '验证码已失效');
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
      // return ResponseUtil.error(HttpStatus.BAD_REQUEST, '验证码不正确');
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
      // return ResponseUtil.error(HttpStatus.BAD_REQUEST, '用户已存在');
    }

    const newUSer = new User();
    newUSer.username = user.username;
    newUSer.password = md5(user.password);
    newUSer.email = user.email;
    newUSer.nickName = user.nickName;

    try {
      await this.userRepository.save(newUSer);
      return '注册成功';
    } catch (error) {
      this.logger.error(error, UserService);
      // return ResponseUtil.error(HttpStatus.INTERNAL_SERVER_ERROR, '注册失败');
      throw new HttpException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 登录
  async login(loginUserDto: LoginUserDto, isAdmin: boolean = false) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      headPic: user.headPic,
      createTime: user.createTime,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roles.map((role) => role.name),
      permissions: user.roles.reduce((arr: any, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
    return vo;
  }

  async findUserById(userId: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return {
      id: user?.id,
      username: user?.username,
      isAdmin: user?.isAdmin,
      email: user?.email,
      roles: user?.roles.map((item) => item.name),
      permissions: user?.roles.reduce((arr: any, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  /**
   * 根据userId查询用户详情
   * @param userId
   * @returns
   */
  async findUserDetailById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    return user;
  }

  /**
   * 修改密码
   */
  async updatePassword(passwordDto: UpdateUserPasswordDto) {
    const captcha = await this.redisService.get(
      `update_password_captcha_${passwordDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (passwordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: passwordDto.username,
    });
    if (foundUser?.email !== passwordDto.email) {
      throw new HttpException('邮箱不正确', HttpStatus.BAD_REQUEST);
    }
    foundUser.password = md5(passwordDto.password);
    try {
      await this.userRepository.save(foundUser);
      return '修改密码成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '修改密码失败';
    }
  }

  /**
   * 修改用户信息
   */
  async update(userId: number, updateUserDto: UpdateUserDto) {
    const captcha = await this.redisService.get(
      `update_user_captcha_${updateUserDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (captcha !== updateUserDto.captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!foundUser) {
      throw new HttpException('该用户信息不存在', HttpStatus.BAD_REQUEST);
    }
    if (updateUserDto?.nickName) {
      foundUser.nickName = updateUserDto.nickName;
    }
    if (updateUserDto?.headPic) {
      foundUser.headPic = updateUserDto.headPic;
    }

    try {
      await this.userRepository.save(foundUser);
      return '用户修改信息成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '用户修改密码失败';
    }
  }

  /**
   * 冻结用户
   */
  async freeUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('该用户不存在', HttpStatus.BAD_REQUEST);
    }
    user.isFrozen = true;

    await this.userRepository.save(user);
  }

  /**
   * 用户列表
   */
  async findUsersByPage(
    pageNo: number,
    pageSize: number,
    username?: string,
    nickName?: string,
    email?: string,
  ) {
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};

    if (username) {
      condition.username = Like(`%${username}`);
    }
    if (nickName) {
      condition.nickName = Like(`%${nickName}`);
    }
    if (email) {
      condition.email = Like(`%${email}`);
    }

    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        // 指定返回的字段
        'id',
        'username',
        'nickName',
        'email',
        'phoneNumber',
        'isFrozen',
        'isAdmin',
        'headPic',
        'createTime',
      ],
      skip: skipCount,
      take: pageSize,
      where: condition,
    });
    const vo = new UserListVo();
    vo.users = users;
    vo.totalCount = totalCount;
    return vo;
  }
}
