import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser, Public } from '../auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Public()
  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.userService.getUser(username);
  }

  @Patch('edit-me')
  update(@GetUser('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete-me')
  remove(@GetUser('id') id: number) {
    this.userService.remove(id);
  }
}
