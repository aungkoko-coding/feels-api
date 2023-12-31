import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { getYoutubeData } from './utils';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { Message } from '@prisma/client';
import { CryptoService } from 'src/crypto/crypto.service';
import { AblyService } from 'src/ably/ably.service';

@Injectable()
export class MessageService {
  youtubeRegex: RegExp;
  constructor(
    private prisma: PrismaService,
    private websocketGateway: WebsocketGateway,
    private cryptoService: CryptoService,
    private ablyService: AblyService,
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
        if (!yt.public && yt.description) {
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
    // const user = await this.prisma.user.findUnique({ where: { username } });
    // this emit doesn't correspond to handleMessage in websocket.gateway.ts file
    // At client-side, user have to listen on gateway like socket.on('message-aungko', message => console.log(message))
    this.ablyService.emitMessage(
      `message-${username}-${message.receiverId}`,
      message,
    );
  }

  //   async getMessages(userId: number, from: number, take: number) {

  async getMessages(userId: number) {
    // const count = await this.prisma.message.count();
    const messages = await this.prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        receiverId: userId,
      },
      // skip: from,
      // take,
      include: {
        youtubeLinks: true,
      },
    });

    return messages;

    // return {
    //   total: count,
    //   messages,
    // };
  }

  async getMessage(messageId: number, userId: number) {
    const message = await this.prisma.message.findUnique({
      where: {
        id: messageId,
        user: {
          id: userId,
        },
      },
      include: {
        youtubeLinks: true,
      },
    });
    if (!message) throw new NotFoundException('Message not found!');

    return message;
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
