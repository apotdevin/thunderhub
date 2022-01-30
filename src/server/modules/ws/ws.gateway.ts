import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';
import { parse } from 'cookie';
import { appConstants } from 'src/server/utils/appConstants';
import { AuthenticationService } from '../auth/auth.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: ['.env.local', '.env'],
});

@WebSocketGateway({ path: `${process.env.BASE_PATH || ''}/socket.io` })
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private socketService: WsService,
    private authService: AuthenticationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @WebSocketServer()
  public server: Server;

  async getUserFromSocket(socket: Socket) {
    const cookie = parse(socket.handshake.headers.cookie);

    const authToken = cookie[appConstants.cookieName] || '';
    if (!authToken) return null;

    const user = await this.authService.getUserFromAuthToken(authToken);
    if (!user) return null;

    return user;
  }

  afterInit(server: Server) {
    this.logger.info('WS server created');
    this.socketService.init(server);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.getUserFromSocket(client);
    client.leave(user);
    this.logger.info(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket) {
    const user = await this.getUserFromSocket(client);

    if (!user) {
      client.disconnect();
    } else {
      client.join(user);
      this.logger.info(`Client connected: ${client.id}`);
    }
  }
}
