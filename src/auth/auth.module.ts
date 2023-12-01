import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { JwtGuard } from './guard';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, JwtStrategy, JwtGuard],
  controllers: [AuthController],
})
export class AuthModule {}
