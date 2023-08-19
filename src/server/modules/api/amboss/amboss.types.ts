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
export class UserBackupInfo {
  @Field({ nullable: true })
  last_update: string;

  @Field({ nullable: true })
  last_update_size: string;

  @Field()
  total_size_saved: string;

  @Field()
  available_size: string;

  @Field()
  remaining_size: string;
}

@ObjectType()
export class AmbossUser {
  @Field(() => AmbossSubscription)
  subscription: AmbossSubscription;

  @Field(() => UserBackupInfo)
  backups: UserBackupInfo;
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

export type NodeAlias = {
  alias: string;
  pub_key: string;
};

export type BaseNodeInfoType = {
  alias: string;
  pub_key: string;
};

export type EdgeInfo = {
  short_channel_id: string;
  info: {
    node1_pub: string;
    node1_info: {
      node: BaseNodeInfoType;
    };
    node2_pub: string;
    node2_info: {
      node: BaseNodeInfoType;
    };
  };
};
