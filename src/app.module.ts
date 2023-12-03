import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MessageModule } from './message/message.module';
import { FeedModule } from './feed/feed.module';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { CryptoService } from './crypto/crypto.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    PrismaModule,
    MessageModule,
    FeedModule,
  ],
  controllers: [],
  providers: [WebsocketGateway, CryptoService],
})
export class AppModule {}
