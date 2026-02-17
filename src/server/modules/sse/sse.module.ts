import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../auth/auth.module';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

@Module({
  imports: [AuthenticationModule],
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
