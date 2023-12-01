import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import axios from 'axios';
import { getYoutubeData } from './utils';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(username: string, messageDto: CreateMessageDto) {
    const { content, youtubeLinks } = messageDto;
    const youtubeRegex =
      /^https:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}(?:\?si=[a-zA-Z0-9_-]+)?$/;

    const length = youtubeLinks?.length || 0;
    if (length > 3)
      throw new ForbiddenException(
        'You are not allowed to send youtube videos more than 3!',
      );
    if (length > 0) {
      const promises = youtubeLinks.map(getYoutubeData);
      try {
        await Promise.all(promises);
      } catch (error) {
        if (!(error instanceof ForbiddenException))
          throw new InternalServerErrorException('Failed to fetch thumbnails!');

        throw error;
      }
    }
    return await this.prisma.message.create({
      include: { youtubeLinks: true },
      data: {
        content,
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

  async getMessages(userId: number) {
    return this.prisma.message.findMany({
      where: {
        receiverId: userId,
      },
      include: {
        youtubeLinks: true,
      },
    });
  }

  async deleteAllMessages() {
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
