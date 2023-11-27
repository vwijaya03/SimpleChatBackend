import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    client: Socket,
    data: { username: string; roomId: string },
  ) {
    try {
      await this.chatService.joinRoom(client.id, data.username, data.roomId);

      this.server.to(client.id).emit('joinRoomSuccess', {
        success: true,
        message: 'Successfully joined the room.',
        data: {
          username: data.username,
          roomId: data.roomId,
          id: client.id,
        },
      });

      this.server.emit(
        'updateUsers',
        this.chatService.getUsersInRoom(data.roomId),
      );
    } catch (error) {
      this.server.to(client.id).emit('joinRoomError', {
        success: false,
        message: `Failed to join the room, ${error.message}`,
      });
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    data: { username: string; roomId: string; message: string },
  ) {
    const { username, roomId, message } = data;

    await this.chatService.addMessage(data.username, data.roomId, data.message);
    // const messages = await this.chatService.getMessagesInRoom(data.roomId);
    // this.server.socketsJoin(data.roomId);
    client.join(data.roomId);
    this.server.to(data.roomId).emit('message', { username, roomId, message });
  }

  @SubscribeMessage('fetchMessagesHistory')
  async handleFetchMessagesHistory(client: Socket, data: { roomId: string }) {
    const { roomId } = data;

    const messages = await this.chatService.getMessagesInRoom(roomId);
    // const messages = await this.chatService.getMessagesInRoom(data.roomId);
    // this.server.socketsJoin(data.roomId);
    console.log('messages', messages.length);
    console.log(messages);
    console.log();
    client.join(roomId);
    this.server.to(roomId).emit('messagesHistory', { roomId, messages });
  }

  @SubscribeMessage('exitRoom')
  async handleExitRoom(
    client: Socket,
    data: { username: string; roomId: string },
  ) {
    const { username, roomId } = data;
    await this.chatService.removeUserFromRoom(username, roomId);
  }
}
