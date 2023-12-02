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
import { GetUser, Public } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@UseGuards(JwtGuard)
@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Public()
  @Post(':username')
  async sendMessage(
    @Param('username') username: string,
    @Body() messageDto: CreateMessageDto,
  ) {
    const message = await this.messageService.sendMessage(username, messageDto);
    this.messageService.emitReceivedMessageEvent(username, message);
    return message;
  }

  @Get()
  getMessages(
    @GetUser('id') userId: number,
    @Query('from', new DefaultValuePipe(0), ParseIntPipe) from: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ) {
    return this.messageService.getMessages(userId, from, take);
  }

  @Patch('seen/:messageId')
  seenMessage(
    @GetUser('id') receiverId: number,
    @Param('messageId') messageId: number,
  ) {
    return this.messageService.seenMessage(receiverId, messageId);
  }

  @Public()
  @Delete()
  deleteAllMessages(@Query('secret') secret: string) {
    return this.messageService.deleteAllMessages(secret);
  }
}
