import { Injectable } from '@nestjs/common';
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
      take,
      skip: from,
    });

    return { total: count, data };
  }
}
