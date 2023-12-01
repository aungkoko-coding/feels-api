import { AuthGuard } from '@nestjs/passport';

// the name 'jwt' is from JwtStrategy. see it
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
