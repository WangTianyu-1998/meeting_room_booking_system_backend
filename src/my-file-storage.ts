import * as multer from 'multer';
import * as fs from 'fs';

/**
 * 这个函数用于创建一个 multer 存储引擎，它将上传的文件存储在指定的目录中。
 * 并且使用当前时间戳和随机数生成一个唯一的文件名。
 */
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = './uploads';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    cb(null, uniqueSuffix);
  },
});
