import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async getFeeds(from: number, take: number) {
    const count = await this.prisma.youTubeLink.count();
    const data = await this.prisma.youTubeLink.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: { public: true },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        url: true,
        description: true,
      },
      take,
      skip: from,
    });

    return { total: count, data };
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
