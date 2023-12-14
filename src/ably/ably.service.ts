import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
@Injectable()
export class AblyService {
  private Ably: any;
  private ably: any;
  constructor() {
    this.Ably = require('ably');
    this.ably = new this.Ably.Realtime.Promise(process.env.ABLY_API_KEY);
  }
  emitMessage(filter: string, message: Message) {
    // const Ably = require('ably');
    // const ably = new Ably.Realtime.Promise(process.env.ABLY_API_KEY);
    const channel = this.ably.channels.get('ably-notification');
    channel.publish(filter, message);
  }
}
