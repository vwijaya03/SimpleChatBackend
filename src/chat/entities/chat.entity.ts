import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;
}

@Schema()
export class Room extends Document {
  @Prop({ required: true, unique: true })
  room_id: string;
}

@Schema()
export class UserRoom extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  room_id: string;
}

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  room_id: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const RoomSchema = SchemaFactory.createForClass(Room);
export const UserRoomSchema = SchemaFactory.createForClass(UserRoom);
export const MessageSchema = SchemaFactory.createForClass(Message);
