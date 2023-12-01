import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feeds')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  getFeeds(
    @Query('from', new DefaultValuePipe(0), ParseIntPipe) from: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ) {
    return this.feedService.getFeeds(from, take);
  }
}
