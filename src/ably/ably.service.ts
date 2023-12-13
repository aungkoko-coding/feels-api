import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
@Injectable()
export class AblyService {
  emitMessage(filter: string, message: Message) {
    const Ably = require('ably');
    const ably = new Ably.Realtime.Promise(process.env.ABLY_API_KEY);
    const channel = ably.channels.get('ably-notification');
    channel.publish(filter, message);
  }
}
