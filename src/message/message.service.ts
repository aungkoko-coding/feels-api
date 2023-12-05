import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { getYoutubeData } from './utils';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { Message } from '@prisma/client';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class MessageService {
  youtubeRegex: RegExp;
  constructor(
    private prisma: PrismaService,
    private websocketGateway: WebsocketGateway,
    private cryptoService: CryptoService,
  ) {
    this.youtubeRegex =
      /^https:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}(?:\?si=[a-zA-Z0-9_-]+)?$/;
  }

  async sendMessage(username: string, messageDto: CreateMessageDto) {
    const { youtubeLinks } = messageDto;

    const length = youtubeLinks?.length || 0;
    if (length > 3)
      throw new ForbiddenException(
        'You are not allowed to send youtube videos more than 3!',
      );
    if (length > 0) {
      const promises = youtubeLinks.map((yt) => {
        if (!yt.public) {
          yt.title = this.cryptoService.encrypt(yt.title);
          yt.description = this.cryptoService.encrypt(yt.description);
        }

        return getYoutubeData(yt, this.cryptoService);
      });
      try {
        await Promise.all(promises);
      } catch (error) {
        if (
          !(error instanceof ForbiddenException) &&
          !(error instanceof BadRequestException)
        )
          throw new InternalServerErrorException('Failed to fetch thumbnails!');

        throw error;
      }
    }
    return await this.prisma.message.create({
      include: { youtubeLinks: true },
      data: {
        content: this.cryptoService.encrypt(messageDto.content),
        user: {
          connect: {
            username,
          },
        },
        youtubeLinks: {
          createMany: {
            data: youtubeLinks || [],
          },
        },
      },
    });
  }

  getUnseenMessagesCount(username: string) {
    return this.prisma.message.count({
      where: { seen: false, user: { username } },
    });
  }

  async emitReceivedMessageEvent(username: string, message: Message) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    // this emit doesn't correspond to handleMessage in websocket.gateway.ts file
    // At client-side, user have to listen on gateway like socket.on('message-aungko', message => console.log(message))
    this.websocketGateway.server.emit(
      `message-${username}-${user.id}`,
      message,
    );
  }

  async getMessages(userId: number, from: number, take: number) {
    const count = await this.prisma.message.count();
    const messages = await this.prisma.message.findMany({
      where: {
        receiverId: userId,
      },
      skip: from,
      take,
      include: {
        youtubeLinks: true,
      },
    });

    return {
      total: count,
      messages,
    };
  }

  async seenMessage(receiverId: number, messageId: number) {
    return this.prisma.message.update({
      where: {
        receiverId,
        id: messageId,
      },
      data: {
        seen: true,
      },
    });
  }

  async deleteAllMessages(secret: string) {
    if (secret !== process.env.SYS_ADMIN_SECRET)
      throw new ForbiddenException(
        'You are not allowed to delete all messages!',
      );
    await this.prisma.message.deleteMany();
  }
}

// {
//     content: 'Hey I am anonymous message',
//     user: {
//       connect: {
//         username,
//       },
//     },
//     youtubeLinks: {
//       createMany: {
//         data: [
//           {
//             title: 'Y1',
//             description: 'y1 description',
//             url: 'blahblah.com',
//           },
//           {
//             title: 'Y2',
//             description: 'y2 description',
//             url: 'blahblah.com',
//           },
//         ],
//       },
//     },
//   },
