import { MongooseModuleOptions } from '@nestjs/mongoose';

const host = 'localhost';
const port = 27017;
const database = 'chats';
const user = 'chat_user';
const pass = 'chat_password';

export const mongoConfig: MongooseModuleOptions = {
  uri: `mongodb://${host}:${port}?authSource=admin`,
  // dbName: database,
};
