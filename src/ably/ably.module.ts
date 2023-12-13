import { Module } from '@nestjs/common';
import { AblyController } from './ably.controller';
import { AblyService } from './ably.service';

@Module({
  controllers: [AblyController],
  providers: [AblyService]
})
export class AblyModule {}
