import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { to } from 'server/helpers/async';
import { grantAccess } from 'ln-service';
import { logger } from 'server/helpers/logger';

export type PermissionsType = {
  is_ok_to_adjust_peers: boolean;
  is_ok_to_create_chain_addresses: boolean;
  is_ok_to_create_invoices: boolean;
  is_ok_to_create_macaroons: boolean;
  is_ok_to_derive_keys: boolean;
  is_ok_to_get_chain_transactions: boolean;
  is_ok_to_get_invoices: boolean;
  is_ok_to_get_wallet_info: boolean;
  is_ok_to_get_payments: boolean;
  is_ok_to_get_peers: boolean;
  is_ok_to_pay: boolean;
  is_ok_to_send_to_chain_addresses: boolean;
  is_ok_to_sign_bytes: boolean;
  is_ok_to_sign_messages: boolean;
  is_ok_to_stop_daemon: boolean;
  is_ok_to_verify_bytes_signatures: boolean;
  is_ok_to_verify_messages: boolean;
};

type ParamsType = {
  permissions: PermissionsType;
};

export const macaroonResolvers = {
  Mutation: {
    createMacaroon: async (
      _: undefined,
      params: ParamsType,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'createMacaroon');

      const { permissions } = params;
      const { lnd } = context;

      const { macaroon, permissions: permissionList } = await to(
        grantAccess({ lnd, ...permissions })
      );

      logger.debug(
        'Macaroon created with the following permissions: %o',
        permissionList.join(', ')
      );

      const hex = Buffer.from(macaroon, 'base64').toString('hex');

      return { base: macaroon, hex };
    },
  },
};
