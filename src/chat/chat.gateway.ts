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
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    data: { roomId: string; username: string; content: string },
  ) {
    await this.chatService.addMessage(data.roomId, data.username, data.content);
    const messages = await this.chatService.getMessagesInRoom(data.roomId);
    this.server.to(data.roomId).emit('message', messages);
  }
}
