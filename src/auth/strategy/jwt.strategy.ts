import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

// this will serve like a middleware but not for every routes. route with @UserGuards
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // you can give any name other than 'jwt'
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  // the returned value will be passed as the request.user in request handler
  async validate(payload: { sub: number; username: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
      delete user.hash;
      return user;
    } catch {
      throw new NotFoundException(
        'User not found! May be you are not authenticated.',
      );
    }
  }
}
