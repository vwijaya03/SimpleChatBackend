import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './config/mongo.config';

@Module({
  imports: [MongooseModule.forRoot(mongoConfig.uri), ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
