import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessIds {
  @Field(() => [Number])
  ids: number[];
}

@ObjectType()
export class LightningQueries {
  @Field(() => AccessIds)
  get_access_ids: AccessIds;
}
