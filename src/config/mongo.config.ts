import { MongooseModuleOptions } from '@nestjs/mongoose';

const host = process.env.MONGO_HOST || 'localhost';
const port = process.env.MONGO_PORT || 27017;
const database = process.env.MONGO_DATABASE || 'chats';
const user = process.env.MONGO_USER || 'chat_user';
const pass = process.env.MONGO_PASS || 'chat_password';

export const mongoConfig: MongooseModuleOptions = {
  uri: `mongodb://${user}:${pass}@${host}:${port}/${database}`,
};
