import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
@Injectable()
export class AblyService {
  private Ably: any;
  private ably: any;
  private channel: any;

  constructor() {
    this.Ably = require('ably');
    this.ably = new this.Ably.Realtime.Promise(process.env.ABLY_API_KEY);
    this.channel = this.ably.channels.get('ably-notification');
  }
  emitMessage(filter: string, message: Message) {
    // const Ably = require('ably');
    // const ably = new Ably.Realtime.Promise(process.env.ABLY_API_KEY);
    this.channel.publish(filter, message);
  }
}
