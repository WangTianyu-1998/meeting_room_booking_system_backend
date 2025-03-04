import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { User } from './user/entities/user.entity';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { Booking } from './booking/entities/booking.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';

config({ path: 'src/.env-migration' });

console.log(process.env);

/**
 * 这是一个 TypeORM 的数据源配置对象。它包含了连接到 MySQL 数据库所需的所有信息，
 * 包括主机名、端口号、用户名、密码、数据库名称、同步选项、日志记录选项、实体、池大小、迁移和额外选项。
 * 它还使用了 mysql2 连接器包和 sha256_password 身份验证插件。
 * @param type 数据库类型
 * @returns
 */
export default new DataSource({
  type: 'mysql',
  host: `${process.env.mysql_server_host}`,
  port: +`${process.env.mysql_server_port}`,
  username: `${process.env.mysql_server_username}`,
  password: `${process.env.mysql_server_password}`,
  database: `${process.env.mysql_server_database}`,
  synchronize: false,
  logging: true,
  entities: [User, Role, Permission, MeetingRoom, Booking],
  poolSize: 10,
  migrations: ['src/migrations/**.ts'],
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
});
