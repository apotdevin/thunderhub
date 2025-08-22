import { Module } from '@nestjs/common';

import { NodeModule } from '../../node/node.module';
import { ToolsResolver } from './tools.resolver';

@Module({ imports: [NodeModule], providers: [ToolsResolver] })
export class ToolsModule {}
