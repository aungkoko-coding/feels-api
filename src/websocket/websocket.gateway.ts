import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
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

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    // Handle incoming messages and broadcast to the user
    this.server.emit(`message-${payload.username}`, payload);
  }
}
