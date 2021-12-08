import { Controller, Get, Res, Req } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { Public } from '../security/security.decorators';
import { ViewService } from './view.service';

const NEXT_ROUTES = [
  // Assets
  'static*',
  'assets*',
  '_next*',
  'favicon.ico',
  // Routes
  '',
  'login',
  'peers',
];

@Public()
@SkipThrottle()
@Controller('/')
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get(NEXT_ROUTES)
  public async showHome(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }
}
