import { Field, ObjectType } from '@nestjs/graphql';

import { Node } from '../node/node.types';

@ObjectType()
export class Peer {
  @Field()
  bytes_received: number;
  @Field()
  bytes_sent: number;
  @Field()
  is_inbound: boolean;
  @Field({ nullable: true })
  is_sync_peer: boolean;
  @Field()
  ping_time: number;
  @Field()
  public_key: string;
  @Field()
  socket: string;
  @Field()
  tokens_received: number;
  @Field()
  tokens_sent: number;
  @Field(() => Node)
  partner_node_info: Node;
}
