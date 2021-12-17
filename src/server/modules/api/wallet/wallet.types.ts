import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Wallet {
  @Field(() => [String])
  build_tags: string[];
  @Field()
  commit_hash: string;
  @Field()
  is_autopilotrpc_enabled: boolean;
  @Field()
  is_chainrpc_enabled: boolean;
  @Field()
  is_invoicesrpc_enabled: boolean;
  @Field()
  is_signrpc_enabled: boolean;
  @Field()
  is_walletrpc_enabled: boolean;
  @Field()
  is_watchtowerrpc_enabled: boolean;
  @Field()
  is_wtclientrpc_enabled: boolean;
}
