import { Controller, Get, Res, Req } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { Public } from '../security/security.decorators';
import { ViewService } from './view.service';

@Public()
@SkipThrottle()
@Controller('/')
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get(['/', '*'])
  public async showHome(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }
}
