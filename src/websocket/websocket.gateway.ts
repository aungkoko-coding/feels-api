import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    // Handle a new connection
  }

  handleDisconnect(client: Socket) {
    // Handle client disconnect
  }

  @SubscribeMessage('newMessage')
  handleMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('received message');
    // Handle incoming messages and broadcast to the user
    // this.server.emit(`newMessage`, message);

    // Business logic to save the message to the database
    // Broadcasting the new message to all connected clients, excluding the sender
    // client.broadcast.emit('newMessage', { message, mes: 'hello' });

    // Let's add a bit of humor - respond to the sender with an acknowledgement
    // client.emit('acknowledgement', 'Your message was received loud and clear!');
  }
}
