import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { NodeService } from '../../node/node.service';
import { BoltzService } from './boltz.service';
import { constructClaimTransaction, detectSwap } from 'boltz-core';
import { generateKeys, getHexBuffer, validateAddress } from './boltz.helpers';
import { GraphQLError } from 'graphql';
import { address, networks, Transaction } from 'bitcoinjs-lib';
import {
  BoltzInfoType,
  BoltzSwap,
  CreateBoltzReverseSwapType,
} from './boltz.types';
import { getPreimageAndHash } from 'src/server/utils/crypto';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { toWithError } from 'src/server/utils/async';
import { ECPairAPI, ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair: ECPairAPI = ECPairFactory(ecc);

@Resolver(BoltzSwap)
export class BoltzSwapResolver {
  constructor(
    private boltzService: BoltzService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @ResolveField()
  async id(@Parent() parent: string) {
    return parent;
  }

  @ResolveField()
  async boltz(@Parent() parent: string) {
    const [info, error] = await toWithError(
      this.boltzService.getSwapStatus(parent)
    );

    if (error || info?.error) {
      this.logger.error(`Error getting status for swap with id: ${parent}`, {
        error: error || info.error,
      });
      return null;
    }

    if (!info?.status) {
      this.logger.debug(
        `No status in Boltz response for swap with id: ${parent}`,
        { info }
      );
      return null;
    }

    return info;
  }
}

@Resolver(CreateBoltzReverseSwapType)
export class CreateBoltzReverseSwapTypeResolver {
  constructor(private nodeService: NodeService) {}

  @ResolveField()
  async decodedInvoice(
    @CurrentUser() user: UserId,
    @Parent() parent: CreateBoltzReverseSwapType
  ) {
    const decoded = await this.nodeService.decodePaymentRequest(
      user.id,
      parent.invoice
    );

    return {
      ...decoded,
      destination_node: { publicKey: decoded.destination },
    };
  }
}

@Resolver()
export class BoltzResolver {
  constructor(
    private nodeService: NodeService,
    private boltzService: BoltzService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => BoltzInfoType)
  async getBoltzInfo() {
    const info = await this.boltzService.getPairs();

    if (info?.error) {
      this.logger.error('Error getting swap information from Boltz', {
        error: info.error,
      });
      throw new Error(info.error);
    }

    const btcPair = info?.pairs?.['BTC/BTC'];

    if (!btcPair) {
      this.logger.error('No BTC > LN BTC information received from Boltz');
      throw new Error('MissingBtcRatesFromBoltz');
    }

    const max = btcPair.limits?.maximal || 0;
    const min = btcPair.limits?.minimal || 0;
    const feePercent = btcPair.fees?.percentage || 0;

    return { max, min, feePercent };
  }

  @Query(() => [BoltzSwap])
  async getBoltzSwapStatus(
    @Args('ids', { type: () => [String] }) ids: string[]
  ) {
    return ids;
  }

  @Mutation(() => String)
  async claimBoltzTransaction(
    @Args('redeem') redeem: string,
    @Args('transaction') transaction: string,
    @Args('preimage') preimage: string,
    @Args('privateKey') privateKey: string,
    @Args('destination') destination: string,
    @Args('fee') fee: number
  ) {
    if (!validateAddress(destination)) {
      this.logger.error(`Invalid bitcoin address: ${destination}`);
      throw new GraphQLError('InvalidBitcoinAddress');
    }

    const redeemScript = getHexBuffer(redeem);
    const lockupTransaction = Transaction.fromHex(transaction);

    const info = detectSwap(redeemScript, lockupTransaction);

    if (info?.vout === undefined || info?.type === undefined) {
      this.logger.error('Cannot get vout or type from Boltz');
      this.logger.debug('Swap info', {
        redeemScript,
        lockupTransaction,
        info,
      });
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

    this.logger.debug('Final transaction', { finalTransaction });

    const response = await this.boltzService.broadcastTransaction(
      finalTransaction.toHex()
    );

    this.logger.debug('Response from Boltz', { response });

    if (!response?.transactionId) {
      this.logger.error('Did not receive a transaction id from Boltz');
      throw new Error('NoTransactionIdFromBoltz');
    }

    return response.transactionId;
  }

  @Mutation(() => CreateBoltzReverseSwapType)
  async createBoltzReverseSwap(
    @CurrentUser() user: UserId,
    @Args('amount') amount: number,
    @Args('address', { nullable: true }) address: string
  ) {
    if (address && !validateAddress(address)) {
      this.logger.error(`Invalid bitcoin address: ${address}`);
      throw new GraphQLError('InvalidBitcoinAddress');
    }

    const { preimage, hash } = getPreimageAndHash();
    const { privateKey, publicKey } = generateKeys();

    let btcAddress = address;

    if (!btcAddress) {
      const info = await this.nodeService.createChainAddress(user.id);

      if (!info?.address) {
        this.logger.error('Error creating onchain address for swap');
        throw new Error('ErrorCreatingOnChainAddress');
      }

      btcAddress = info.address;
    }

    this.logger.debug('Creating swap with these params', {
      amount,
      hash,
      publicKey,
    });

    const info = await this.boltzService.createReverseSwap(
      amount,
      hash,
      publicKey
    );

    if (info?.error) {
      this.logger.error('Error creating reverse swap with Boltz', info.error);
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

    this.logger.debug('Swap info', { finalInfo });

    return finalInfo;
  }
}
