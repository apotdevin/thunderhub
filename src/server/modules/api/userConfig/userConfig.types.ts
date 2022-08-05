import { Field, ObjectType } from '@nestjs/graphql';

export enum ConfigFields {
  BACKUPS = 'BACKUPS',
  HEALTHCHECKS = 'HEALTHCHECKS',
  ONCHAIN_PUSH = 'ONCHAIN_PUSH',
  CHANNELS_PUSH = 'CHANNELS_PUSH',
  PRIVATE_CHANNELS_PUSH = 'PRIVATE_CHANNELS_PUSH',
}

@ObjectType()
export class ConfigState {
  @Field()
  backup_state: boolean;
  @Field()
  healthcheck_ping_state: boolean;
  @Field()
  onchain_push_enabled: boolean;
  @Field()
  channels_push_enabled: boolean;
  @Field()
  private_channels_push_enabled: boolean;
}
