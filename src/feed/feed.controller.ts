import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  // @Get()
  // getFeeds(
  //   @Query('from', new DefaultValuePipe(0), ParseIntPipe) from: number,
  //   @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  // ) {
  //   return this.feedService.getFeeds(from, take);
  // }

  @Get()
  getFeeds(
    @Body('timestamp', new DefaultValuePipe(new Date().toISOString()))
    timestamp: string,
    @Body('from', new DefaultValuePipe(0), ParseIntPipe) from: number,
    @Body('take', new DefaultValuePipe(30), ParseIntPipe) take: number,
  ) {
    return this.feedService.getFeeds(timestamp, from, take);
  }

  @Get(':feedId')
  getFeed(@Param('feedId', ParseIntPipe) feedId: number) {
    return this.feedService.getFeedById(feedId);
  }
}
