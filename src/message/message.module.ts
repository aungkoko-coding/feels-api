import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Module({
  providers: [MessageService, WebsocketGateway],
  controllers: [MessageController],
})
export class MessageModule {}
