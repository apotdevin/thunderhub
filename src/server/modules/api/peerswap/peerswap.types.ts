import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PeerSwapSwapType {
  @Field()
  id: string;
  @Field()
  createdAt: string;
  @Field()
  type: string;
  @Field()
  role: string;
  @Field()
  state: string;
  @Field()
  initiatorNodeId: string;
  @Field()
  peerNodeId: string;
  @Field()
  amount: string;
  @Field()
  channelId: string;
  @Field()
  openingTxId: string;
  @Field()
  claimTxId: string;
  @Field()
  cancelMessage: string;
}

@ObjectType()
export class PeerSwapStatsType {
  @Field()
  swapsOut: string;
  @Field()
  swapsIn: string;
  @Field()
  satsOut: string;
  @Field()
  satsIn: string;
}

@ObjectType()
export class PeerSwapChannelType {
  @Field()
  channelId: string;
  @Field()
  localBalance: string;
  @Field()
  remoteBalance: string;
  @Field()
  localPercentage: string;
  @Field()
  active: boolean;
}

@ObjectType()
export class PeerSwapPeerType {
  @Field(() => [String])
  supportedAssets: string[];
  @Field(() => [PeerSwapChannelType])
  channels: PeerSwapChannelType[];
  @Field()
  nodeId: string;
  @Field()
  swapsAllowed: boolean;
  @Field(() => PeerSwapStatsType)
  asSender: PeerSwapStatsType;
  @Field(() => PeerSwapStatsType)
  asReceiver: PeerSwapStatsType;
  @Field()
  paidFee: string;
}

@ObjectType()
export class GetPeerSwapSwapsType {
  @Field(() => [PeerSwapSwapType])
  swaps: PeerSwapSwapType[];
}

@ObjectType()
export class GetPeerSwapPeersType {
  @Field(() => [PeerSwapPeerType])
  peers: PeerSwapPeerType[];
}
