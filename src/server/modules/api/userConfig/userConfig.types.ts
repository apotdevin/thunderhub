import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConfigState {
  @Field()
  backup_state: boolean;
  @Field()
  healthcheck_ping_state: boolean;
}
