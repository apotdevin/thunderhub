import { Module } from '@nestjs/common';
import { NodeModule } from '../../node/node.module';
import { HealthResolver } from './health.resolver';

@Module({
  imports: [NodeModule],
  providers: [HealthResolver],
})
export class HealthModule {}
