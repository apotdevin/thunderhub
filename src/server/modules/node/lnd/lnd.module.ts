import { Module } from '@nestjs/common';

import { LndService } from './lnd.service';

@Module({ providers: [LndService], exports: [LndService] })
export class LndModule {}
