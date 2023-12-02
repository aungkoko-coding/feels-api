import {
  Controller,
  Param,
  Post,
  Get,
  UseGuards,
  Body,
  Delete,
  Patch,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Controller('messages')
export class MessageController {
  constructor(
    private messageService: MessageService,
    private websocketGateway: WebsocketGateway,
  ) {}

  @Post(':username')
  async sendMessage(
    @Param('username') username: string,
    @Body() messageDto: CreateMessageDto,
  ) {
    const message = await this.messageService.sendMessage(username, messageDto);

    // this emit doesn't correspond to handleMessage in websocket.gateway.ts file
    // At client-side, user have to listen on gateway like socket.on('message-aungko', message => console.log(message))
    this.websocketGateway.server.emit(`message-${username}`, { message });

    return message;
  }

  @UseGuards(JwtGuard)
  @Get()
  getMessages(
    @GetUser('id') userId: number,
    @Query('from', new DefaultValuePipe(0), ParseIntPipe) from: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ) {
    return this.messageService.getMessages(userId, from, take);
  }

  @UseGuards(JwtGuard)
  @Patch('seen/:messageId')
  seenMessage(
    @GetUser('id') receiverId: number,
    @Param('messageId') messageId: number,
  ) {
    return this.messageService.seenMessage(receiverId, messageId);
  }

  @Delete()
  deleteAllMessages() {
    return this.messageService.deleteAllMessages();
  }
}
