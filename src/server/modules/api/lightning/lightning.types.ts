import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessIds {
  @Field(() => [String])
  ids: string[];
}

@ObjectType()
export class LightningQueries {
  @Field()
  id: string;
  @Field(() => AccessIds)
  get_access_ids: AccessIds;
}
