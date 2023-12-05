import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async getFeeds(timestamp: string, from: number, take: number) {
    console.log(timestamp);
    const data = await this.prisma.youTubeLink.findMany({
      // orderBy: {
      //   createdAt: 'desc',
      // },
      where: {
        public: true,
        createdAt: {
          lt: new Date(timestamp),
        },
      },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        url: true,
        description: true,
        createdAt: true,
      },
      take,
      skip: from,
    });

    return data;
  }

  async getFeedById(id: number) {
    const yt = await this.prisma.youTubeLink.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        url: true,
        description: true,
      },
    });
    if (!yt) throw new NotFoundException('Feed not found');

    return yt;
  }
}
