import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { CryptoService } from 'src/crypto/crypto.service';
import { AblyModule } from 'src/ably/ably.module';
import { AblyService } from 'src/ably/ably.service';

@Module({
  imports: [AblyModule],
  providers: [MessageService, WebsocketGateway, CryptoService, AblyService],
  controllers: [MessageController],
})
export class MessageModule {}
