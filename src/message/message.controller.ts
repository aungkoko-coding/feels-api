import {
  Controller,
  Param,
  Post,
  Get,
  UseGuards,
  Body,
  Delete,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post(':username')
  sendMessage(
    @Param('username') username: string,
    @Body() messageDto: CreateMessageDto,
  ) {
    return this.messageService.sendMessage(username, messageDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  getMessage(@GetUser('id') userId: number) {
    return this.messageService.getMessages(userId);
  }

  @Delete()
  deleteAllMessages() {
    return this.messageService.deleteAllMessages();
  }
}
