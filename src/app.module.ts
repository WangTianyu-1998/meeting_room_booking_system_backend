import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';
import { PermissionGuard } from './permission.guard';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { BookingModule } from './booking/booking.module';
import * as path from 'path';

@Module({
  imports: [
    // jwt
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m', //默认30分钟
          },
        };
      },
      inject: [ConfigService],
    }),
    // 指定全局配置env
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: 'src/.env',
      envFilePath: path.join(__dirname, '.env'),
    }),
    // mysql配置
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: false, // 取消自动同步实体到数据库
          // synchronize: true,
          logging: true,
          entities: [User, Role, Permission, MeetingRoom],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      // 导出全局配置ConfigService
      inject: [ConfigService],
    }),
    UserModule,
    RoleModule,
    PermissionModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // 登录Jwt
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
