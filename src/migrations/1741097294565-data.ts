import { MigrationInterface, QueryRunner } from 'typeorm';

export class Data1741097294565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO `users` (`id`, `username`, `password`, `nickName`, `email`, `headPic`, `phoneNumber`, `isFrozen`, `isAdmin`, `createTime`, `updateTime`) VALUES (1,'wang','4297f44b13955235245b2497399d7a93','tianyu','xxxx@xx.com',NULL,NULL,0,0,'2025-02-16 03:31:08.913828','2025-02-16 03:31:08.913828'),(2,'wang1','4297f44b13955235245b2497399d7a93','tianyu','65876295@qq.com',NULL,NULL,0,0,'2025-02-16 04:02:59.449956','2025-02-16 04:02:59.449956'),(3,'wang2','4297f44b13955235245b2497399d7a93','tianyu','65876295@qq.com',NULL,NULL,1,0,'2025-02-16 04:23:13.461356','2025-03-01 02:46:45.000000'),(4,'wang3','4297f44b13955235245b2497399d7a93','tianyu','65876295@qq.com',NULL,NULL,0,0,'2025-02-16 04:23:48.127008','2025-02-16 04:23:48.127008'),(5,'wang5','4297f44b13955235245b2497399d7a93','tianyu','65876295@qq.com',NULL,NULL,0,0,'2025-02-16 04:23:52.477464','2025-02-16 04:23:52.477464'),(6,'wang5123','4297f44b13955235245b2497399d7a93','tianyu','65876295@qq.com',NULL,NULL,0,0,'2025-02-16 04:24:02.262649','2025-02-16 04:24:02.262649'),(7,'wang1112','4297f44b13955235245b2497399d7a93','tianyu','65876295@qq.com',NULL,NULL,0,0,'2025-02-16 14:16:08.523042','2025-02-16 14:16:08.523042'),(8,'zhangsan','1a100d2c0dab19c4430e7d73762b3423','张三','xxx@xx.com',NULL,'13233323333',1,1,'2025-02-17 12:38:32.777375','2025-03-01 02:45:31.000000'),(9,'lisi','e3ceb5881a0a1fdaad01296d7554868d','lisi','yy@yy.com','xxx11.png',NULL,1,0,'2025-02-17 12:38:32.782288','2025-02-24 15:30:37.000000'),(10,'wangtianyu','7a54feddfa6988ba423ad9ca262193d0','大帅哥','65876295@qq.com','aaa.png',NULL,0,0,'2025-02-24 14:51:38.986153','2025-02-24 15:55:57.000000'),(11,'tianyu.wang','7a54feddfa6988ba423ad9ca262193d0','大帅哥！！','65876295@qq.com','uploads/1740660746806-512998622-è¯¦æ-3.jpg',NULL,0,1,'2025-02-24 16:12:30.280341','2025-02-27 13:52:42.352896');",
    );
    await queryRunner.query(
      "INSERT INTO `meeting_room` VALUES (2,'金星',5,'二层东','','',0,'2025-03-01 14:12:47.543404','2025-03-01 14:12:47.543404'),(3,'天王星1122',30,'三层东','白板，电视','123123',0,'2025-03-01 14:12:47.543000','2025-03-01 14:12:47.543000'),(4,'123123',2,'11','232','2323',0,'2025-03-02 06:58:30.582171','2025-03-02 06:58:30.582171'),(5,'12312322',222,'222','22','222',0,'2025-03-02 06:58:48.229289','2025-03-02 06:58:48.229289'),(6,'ccc',22,'cc','c','c',0,'2025-03-02 06:59:59.036132','2025-03-02 06:59:59.036132'),(7,'1sss',2,'s','2','2',0,'2025-03-02 07:00:27.610892','2025-03-02 07:00:27.610892');",
    );
    await queryRunner.query(
      "INSERT INTO `permissions` VALUES (1,'ccc','访问 ccc 接口'),(2,'ddd','访问 ddd 接口');",
    );
    await queryRunner.query(
      "INSERT INTO `roles` VALUES (1,'管理员'),(2,'普通用户');",
    );
    await queryRunner.query(
      'INSERT INTO `role_permissions` VALUES (1,1),(1,2),(2,1);',
    );
    await queryRunner.query('INSERT INTO `user_roles` VALUES (8,1),(9,2);');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query('TRUNCATE TABLE booking');
  }
}
