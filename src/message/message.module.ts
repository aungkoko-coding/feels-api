import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
  providers: [MessageService, WebsocketGateway, CryptoService],
  controllers: [MessageController],
})
export class MessageModule {}
