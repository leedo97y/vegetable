import mongoose from 'mongoose';
import { dbTestHandler } from './dbTestHandler.js';

const DB_URL =
  process.env.MONGODB_URL ||
  'MongoDB 서버 주소가 설정되지 않았습니다.\n./db/index.ts 파일을 확인해 주세요. \n.env 파일도 필요합니다.\n';

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on('connected', async () => {
  console.log('정상적으로 MongoDB 서버에 연결되었습니다.  ' + DB_URL);
  if (process.env.NODE_ENV === 'dev') {
    await db.dropDatabase();
    await dbTestHandler(db);
  }
});

db.on('error', (error) =>
  console.error('\nMongoDB 연결에 실패하였습니다...\n' + DB_URL + '\n' + error)
);

export * from './models/userModel.js';
export * from './models/productModel.js';
export * from './models/categoryModel.js';
export * from './models/orderModel.js';
