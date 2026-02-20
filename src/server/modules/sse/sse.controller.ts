import {
  Controller,
  Inject,
  Req,
  Sse,
  UnauthorizedException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Observable, Subject } from 'rxjs';
import { Request } from 'express';
import { parse } from 'cookie';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { appConstants } from 'src/server/utils/appConstants';
import { AuthenticationService } from '../auth/auth.service';
import { SseService } from './sse.service';

@Controller('api/sse')
export class SseController {
  constructor(
    private sseService: SseService,
    private authService: AuthenticationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @SkipThrottle()
  @Sse('events')
  async events(@Req() req: Request): Promise<Observable<MessageEvent>> {
    const cookies = parse(req.headers.cookie || '');
    const authToken = cookies[appConstants.cookieName] || '';

    const userId = await this.authService.getUserFromAuthToken(authToken);

    if (!userId) {
      throw new UnauthorizedException();
    }

    this.logger.info(`SSE client connected: ${userId}`);

    const subject = new Subject<MessageEvent>();

    this.sseService.register(userId, subject);

    // Send heartbeat every 30s to keep connection alive
    const heartbeat = setInterval(() => {
      subject.next({ data: ':keepalive' } as MessageEvent);
    }, 30000);

    req.on('close', () => {
      clearInterval(heartbeat);
      this.sseService.unregister(userId, subject);
      subject.complete();
      this.logger.info(`SSE client disconnected: ${userId}`);
    });

    return subject.asObservable();
  }
}
