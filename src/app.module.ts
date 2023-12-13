import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MessageModule } from './message/message.module';
import { FeedModule } from './feed/feed.module';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { CryptoService } from './crypto/crypto.service';
import { AblyController } from './ably/ably.controller';
import { AblyModule } from './ably/ably.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    PrismaModule,
    MessageModule,
    FeedModule,
    AblyModule,
  ],
  providers: [WebsocketGateway, CryptoService],
})
export class AppModule {}
