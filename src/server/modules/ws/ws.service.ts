import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WsService {
  private socket: Server = null;

  init(socket: Server) {
    this.socket = socket;
  }

  emit(account: string, event: string, payload: any) {
    if (!this.socket || !account || !event || !payload) return;
    this.socket.in(account).emit(event, payload);
  }
}
