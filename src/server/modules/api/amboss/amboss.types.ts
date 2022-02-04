import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AmbossSubscription {
  @Field()
  end_date: string;
  @Field()
  subscribed: boolean;
  @Field()
  upgradable: boolean;
}

@ObjectType()
export class AmbossUser {
  @Field(() => AmbossSubscription, { nullable: true })
  subscription: AmbossSubscription;
}

@ObjectType()
export class LightningAddress {
  @Field()
  pubkey: string;
  @Field()
  lightning_address: string;
}

@ObjectType()
export class NodeSocialInfo {
  @Field({ nullable: true })
  private: boolean;
  @Field({ nullable: true })
  telegram: string;
  @Field({ nullable: true })
  twitter: string;
  @Field({ nullable: true })
  twitter_verified: boolean;
  @Field({ nullable: true })
  website: string;
  @Field({ nullable: true })
  email: string;
}

@ObjectType()
export class NodeSocial {
  @Field(() => NodeSocialInfo, { nullable: true })
  info: NodeSocialInfo;
}

@ObjectType()
export class LightningNodeSocialInfo {
  @Field(() => NodeSocial, { nullable: true })
  socials: NodeSocial;
}
