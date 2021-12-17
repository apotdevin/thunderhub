import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Utxo {
  @Field()
  address: string;
  @Field()
  address_format: string;
  @Field()
  confirmation_count: number;
  @Field()
  output_script: string;
  @Field()
  tokens: number;
  @Field()
  transaction_id: string;
  @Field()
  transaction_vout: number;
}

@ObjectType()
export class ChainTransaction {
  @Field({ nullable: true })
  block_id?: string;
  @Field({ nullable: true })
  confirmation_count?: number;
  @Field({ nullable: true })
  confirmation_height?: number;
  @Field()
  created_at: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  fee?: number;
  @Field()
  id: string;
  @Field()
  is_confirmed: boolean;
  @Field()
  is_outgoing: boolean;
  @Field(() => [String])
  output_addresses: string[];
  @Field()
  tokens: number;
  @Field({ nullable: true })
  transaction?: string;
}

@ObjectType()
export class ChainAddressSend {
  @Field()
  confirmationCount: number;
  @Field()
  id: string;
  @Field()
  isConfirmed: boolean;
  @Field()
  isOutgoing: boolean;
  @Field({ nullable: true })
  tokens: number;
}
