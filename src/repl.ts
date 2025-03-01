import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * 启动 repl 服务 目的是为了在不执行路由的情况下,直接调用server服务
 * 在package.json中添加 "repl": "nest start --watch --entryFile repl",
 * 执行 npm run repl 启动服务
 * methods(MeetingRoomService) 查看所有可以调用的方法
 * 调用方法: get(MeetingRoomService).initData()
 */
const bootstrap = async () => {
  const replService = await repl(AppModule);
  replService.setupHistory('.nest_repl_history', (err) => {
    if (err) {
      console.log(err);
    }
  });
};

void bootstrap();
