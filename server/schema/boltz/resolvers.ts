import { BoltzApi } from 'server/api/Boltz';
import { to, toWithError } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { ContextType } from 'server/types/apiTypes';
import { createChainAddress, decodePaymentRequest } from 'ln-service';
import { constructClaimTransaction, detectSwap } from 'boltz-core';
import {
  CreateChainAddressType,
  DecodedType,
} from 'server/types/ln-service.types';
import {
  getPreimageAndHash,
  getPrivateAndPublicKey,
} from 'server/helpers/crypto';
import { address, ECPair, networks, Transaction } from 'bitcoinjs-lib';

const getHexBuffer = (input: string) => {
  return Buffer.from(input, 'hex');
};

type BoltzInfoType = {
  max: number;
  min: number;
  feePercent: number;
};

type BoltzSwapStatusParams = {
  ids: string[];
};

type CreateSwapParams = {
  amount: number; // Value in satoshis
  address?: string;
};

type ClaimTransactionParams = {
  redeem: string;
  transaction: string;
  preimage: string;
  privateKey: string;
  destination: string;
  fee: number;
};

type CreateBoltzReverseSwapType = {
  id: string;
  invoice: string;
  redeemScript: string;
  onchainAmount: number;
  timeoutBlockHeight: number;
  lockupAddress: string;
  minerFeeInvoice: string;
};

export const boltzResolvers = {
  Query: {
    getBoltzInfo: async (
      _: undefined,
      __: any,
      context: ContextType
    ): Promise<BoltzInfoType> => {
      await requestLimiter(context.ip, 'getBoltzInfo');

      const info = await BoltzApi.getPairs();

      if (info?.error) {
        logger.error(
          'Error getting swap information from Boltz. Error: %o',
          info.error
        );
        throw new Error(info.error);
      }

      const btcPair = info?.pairs?.['BTC/BTC'];

      if (!btcPair) {
        logger.error('No BTC > LN BTC information received from Boltz');
        throw new Error('MissingBtcRatesFromBoltz');
      }

      const max = btcPair.limits?.maximal || 0;
      const min = btcPair.limits?.minimal || 0;
      const feePercent = btcPair.fees?.percentage || 0;

      return { max, min, feePercent };
    },
    getBoltzSwapStatus: async (_: undefined, { ids }: BoltzSwapStatusParams) =>
      ids,
  },
  Mutation: {
    claimBoltzTransaction: async (
      _: undefined,
      {
        redeem,
        transaction,
        preimage,
        privateKey,
        destination,
        fee,
      }: ClaimTransactionParams,
      { ip }: ContextType
    ) => {
      await requestLimiter(ip, 'claimBoltzTransaction');

      const redeemScript = getHexBuffer(redeem);
      const lockupTransaction = Transaction.fromHex(transaction);

      const info = detectSwap(redeemScript, lockupTransaction);

      if (!info?.vout || !info.type) {
        logger.error('Can not get vout or type from Boltz');
        throw new Error('ErrorCreatingClaimTransaction');
      }

      const utxos = [
        {
          ...info,
          redeemScript,
          txHash: lockupTransaction.getHash(),
          preimage: getHexBuffer(preimage),
          keys: ECPair.fromPrivateKey(getHexBuffer(privateKey)),
        },
      ];

      const destinationScript = address.toOutputScript(
        destination,
        networks.bitcoin
      );

      const finalTransaction = constructClaimTransaction(
        utxos,
        destinationScript,
        fee
      );

      logger.debug('Final transaction: %o', finalTransaction);

      const response = await BoltzApi.broadcastTransaction(
        finalTransaction.toHex()
      );

      logger.debug('Response from Boltz: %o', { response });

      if (!response?.transactionId) {
        logger.error('Did not receive a transaction id from Boltz');
        throw new Error('NoTransactionIdFromBoltz');
      }

      return response.transactionId;
    },
    createBoltzReverseSwap: async (
      _: undefined,
      { amount, address }: CreateSwapParams,
      context: ContextType
    ) => {
      await requestLimiter(context.ip, 'createReverseSwap');

      const { lnd } = context;

      const { preimage, hash } = getPreimageAndHash();
      const { privateKey, publicKey } = getPrivateAndPublicKey();

      let btcAddress = address;

      if (!btcAddress) {
        const info = await to<CreateChainAddressType>(
          createChainAddress({
            lnd,
            is_unused: true,
            format: 'p2wpkh',
          })
        );

        if (!info?.address) {
          logger.error('Error creating onchain address for swap');
          throw new Error('ErrorCreatingOnChainAddress');
        }

        btcAddress = info.address;
      }

      logger.debug('Creating swap with these params: %o', {
        amount,
        hash,
        publicKey,
      });

      const info = await BoltzApi.createReverseSwap(amount, hash, publicKey);

      if (info?.error) {
        logger.error('Error creating reverse swap with Boltz: %o', info.error);
        throw new Error(info.error);
      }

      const finalInfo = {
        ...info,
        receivingAddress: btcAddress,
        preimage: preimage.toString('hex'),
        preimageHash: hash,
        privateKey,
        publicKey,
      };

      logger.debug('Swap info: %o', { finalInfo });

      return finalInfo;
    },
  },
  BoltzSwap: {
    id: (parent: string) => parent,
    boltz: async (parent: string) => {
      const [info, error] = await toWithError(BoltzApi.getSwapStatus(parent));

      if (error || info?.error) {
        logger.error(
          `Error getting status for swap with id: ${parent}. Error: %o`,
          error || info.error
        );
        return null;
      }

      if (!info?.status) {
        logger.debug(
          `No status in Boltz response for swap with id: ${parent}. Response: %o`,
          info
        );
        return null;
      }

      return info;
    },
  },
  CreateBoltzReverseSwapType: {
    decodedInvoice: async (
      parent: CreateBoltzReverseSwapType,
      _: undefined,
      context: ContextType
    ) => {
      const { lnd } = context;

      const decoded = await to<DecodedType>(
        decodePaymentRequest({
          lnd,
          request: parent.invoice,
        })
      );

      return {
        ...decoded,
        destination_node: { lnd, publicKey: decoded.destination },
      };
    },
  },
};
