import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Room, UserRoom, Message } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    @InjectModel(UserRoom.name) private readonly userRoomModel: Model<UserRoom>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async joinRoom(
    client_id: string,
    username: string,
    room_id: string,
  ): Promise<{ username: string; room_id: string } | string> {
    // Check if username is already taken in the room
    const userInRoom = await this.userRoomModel.findOne({ username, room_id });
    if (userInRoom) {
      throw new Error('Username already exist');
    }

    // Create new user if not exists
    const existingUser = await this.userModel.findOne({ username });
    if (!existingUser) {
      await this.userModel.create({ username });
    }

    // Create new room if not exists
    const existingRoom = await this.roomModel.findOne({ room_id });
    if (!existingRoom) {
      await this.roomModel.create({ room_id });
    }

    // Insert username & room_id in users_rooms
    await this.userRoomModel.create({ username, room_id, client_id });

    return { username, room_id };
  }

  async addMessage(
    username: string,
    room_id: string,
    message: string,
  ): Promise<void> {
    await this.messageModel.create({ username, room_id, message });
  }

  async getMessagesInRoom(roomId: string): Promise<Message[]> {
    const messages = await this.messageModel
      .find({ room_id: roomId })
      .sort({ created_at: -1 })
      .limit(25);
    return messages;
  }

  async getUsersInRoom(roomId: string): Promise<User[]> {
    const userRoom = await this.userRoomModel.find({ roomId });
    return userRoom && userRoom.length > 0 ? userRoom : [];
  }

  async removeUserFromRoom(username: string, roomId: string): Promise<void> {
    await this.userRoomModel.deleteOne({ username, room_id: roomId });
  }

  async removeUserFromRoomByClientId(client_id: string): Promise<void> {
    await this.userRoomModel.deleteOne({ client_id });
  }
}
