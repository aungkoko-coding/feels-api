import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user)
      throw new NotFoundException(
        `User with '${username}' could not be found!`,
      );

    delete user.hash;

    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...updateUserDto,
        },
      });

      delete user.hash;

      return user;
    } catch {
      throw new NotFoundException('Not found user to update!');
    }
  }

  async remove(userId: number) {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
