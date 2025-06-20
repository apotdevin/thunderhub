import { Injectable, OnModuleInit } from '@nestjs/common';
import createServer from 'next';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ViewService implements OnModuleInit {
  private server;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      this.server = createServer({
        dev: !this.configService.get<boolean>('isProduction'),
        dir: './src/client',
      });
      await this.server.prepare();
    } catch (error) {
      console.error(error);
    }
  }

  handler(req: Request, res: Response) {
    return this.server.getRequestHandler()(req, res);
  }
}
