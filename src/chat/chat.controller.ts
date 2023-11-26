import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('join')
  async joinRoom(
    @Body() { username, roomId }: { username: string; roomId: string },
  ): Promise<any> {
    try {
      if (!username || !roomId) {
        throw new BadRequestException('Username and RoomId are required.');
      }

      // const response = await this.chatService.joinRoom(username, roomId);

      return {
        success: true,
        message: 'Successfully joined the room.',
        response: 'test',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An error occurred while joining the room.',
      };
    }
  }
}
