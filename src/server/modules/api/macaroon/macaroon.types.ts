import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class BakeSuperMacaroonInput {
  @Field({ description: 'LITD REST endpoint (e.g. https://host:8443)' })
  rest_host: string;
  @Field({ defaultValue: false })
  read_only: boolean;
}

@ObjectType()
export class SuperMacaroon {
  @Field()
  base: string;
  @Field()
  hex: string;
}

@InputType()
export class NetworkInfoInput {
  @Field()
  is_ok_to_adjust_peers: boolean;
  @Field()
  is_ok_to_create_chain_addresses: boolean;
  @Field()
  is_ok_to_create_invoices: boolean;
  @Field()
  is_ok_to_create_macaroons: boolean;
  @Field()
  is_ok_to_derive_keys: boolean;
  @Field()
  is_ok_to_get_access_ids: boolean;
  @Field()
  is_ok_to_get_chain_transactions: boolean;
  @Field()
  is_ok_to_get_invoices: boolean;
  @Field()
  is_ok_to_get_wallet_info: boolean;
  @Field()
  is_ok_to_get_payments: boolean;
  @Field()
  is_ok_to_get_peers: boolean;
  @Field()
  is_ok_to_pay: boolean;
  @Field()
  is_ok_to_revoke_access_ids: boolean;
  @Field()
  is_ok_to_send_to_chain_addresses: boolean;
  @Field()
  is_ok_to_sign_bytes: boolean;
  @Field()
  is_ok_to_sign_messages: boolean;
  @Field()
  is_ok_to_stop_daemon: boolean;
  @Field()
  is_ok_to_verify_bytes_signatures: boolean;
  @Field()
  is_ok_to_verify_messages: boolean;
}

@ObjectType()
export class CreateMacaroon {
  @Field()
  base: string;
  @Field()
  hex: string;
}
