import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(authDto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: authDto.username,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect!');

    const pwdMatches = await argon.verify(user.hash, authDto.password);
    if (!pwdMatches) throw new ForbiddenException("Password doesn't match!");

    return this.signToken(user.id, user.username);
  }

  async signUp(authDto: AuthDto) {
    try {
      const hash = await argon.hash(authDto.password);
      const user = await this.prisma.user.create({
        data: {
          username: authDto.username,
          hash,
        },
      });

      return this.signToken(user.id, user.username);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // unique field duplicate status code (in this case: same email)
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken!');
        }
      }
      throw error;
    }
  }

  async signToken(userId: number, username: string) {
    const payload = {
      sub: userId,
      username,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_SECRET'),
    });

    return { token };
  }
}
