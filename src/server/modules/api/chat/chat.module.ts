import { Module } from '@nestjs/common';

import { NodeModule } from '../../node/node.module';
import { ChatResolver } from './chat.resolver';

@Module({
  imports: [NodeModule],
  providers: [ChatResolver],
})
export class ChatModule {}
