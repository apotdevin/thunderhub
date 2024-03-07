import zkpInit from '@vulpemventures/secp256k1-zkp';
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
import {
  ClaimDetails,
  SwapTreeSerializer,
  TaprootUtils,
  constructClaimTransaction,
  detectSwap,
  targetFee,
} from 'boltz-core';
import {
  findTaprootOutput,
  generateKeys,
  getHexBuffer,
  validateAddress,
} from './boltz.helpers';
import { GraphQLError } from 'graphql';
import { address, initEccLib, networks, Transaction } from 'bitcoinjs-lib';
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

    const btcPair = info?.BTC?.BTC;

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
    @Args('id') id: string,
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

    initEccLib(ecc);

    const checkOutput = (output: any | undefined) => {
      if (output === undefined) {
        this.logger.error('Cannot get vout or type from Boltz');
        this.logger.debug('Swap info', {
          lockupTransaction,
          output,
        });
        throw new Error('ErrorCreatingClaimTransaction');
      }
    };

    const lockupTransaction = Transaction.fromHex(transaction);
    const keys = ECPair.fromPrivateKey(getHexBuffer(privateKey));

    const destinationScript = address.toOutputScript(
      destination,
      networks.bitcoin
    );

    const isTaproot = redeem.startsWith('{');

    if (isTaproot) {
      const zkp = await zkpInit();
      const tree = SwapTreeSerializer.deserializeSwapTree(redeem);
      const output = findTaprootOutput(zkp, lockupTransaction, tree, keys);
      checkOutput(output);

      const utxo: ClaimDetails = {
        ...output.swapOutput,
        keys,
        swapTree: tree,
        cooperative: true,
        preimage: getHexBuffer(preimage),
        txHash: lockupTransaction.getHash(),
        internalKey: output.musig.getAggregatedPublicKey(),
      };

      // Try the cooperative key path spend first
      try {
        const claimTransaction = this.constructTransaction(
          [utxo],
          destinationScript,
          fee
        );
        const theirPartial =
          await this.boltzService.getReverseSwapClaimSignature(
            id,
            preimage,
            claimTransaction.toHex(),
            0,
            Buffer.from(output.musig.getPublicNonce()).toString('hex')
          );

        output.musig.aggregateNonces([
          [output.theirPublicKey, getHexBuffer(theirPartial.pubNonce)],
        ]);
        output.musig.initializeSession(
          TaprootUtils.hashForWitnessV1([utxo], claimTransaction, 0)
        );
        output.musig.addPartial(
          output.theirPublicKey,
          getHexBuffer(theirPartial.partialSignature)
        );
        output.musig.signPartial();
        claimTransaction.ins[0].witness = [output.musig.aggregatePartials()];

        return this.broadcastTransaction(claimTransaction);
      } catch (e) {
        this.logger.warn(`Cooperative Swap claim failed`, e);
      }

      // If cooperative fails, enforce the HTLC via a script path spend
      utxo.cooperative = false;
      return this.broadcastTransaction(
        this.constructTransaction([utxo], destinationScript, fee)
      );
    } else {
      const redeemScript = getHexBuffer(redeem);
      const output = detectSwap(redeemScript, lockupTransaction);
      checkOutput(output);

      return this.broadcastTransaction(
        this.constructTransaction(
          [
            {
              ...output,
              keys,
              redeemScript,
              txHash: lockupTransaction.getHash(),
              preimage: getHexBuffer(preimage),
            },
          ],
          destinationScript,
          fee
        )
      );
    }
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
      redeemScript: JSON.stringify(info.swapTree),
      preimageHash: hash,
      privateKey,
      publicKey,
    };

    this.logger.debug('Swap info', { finalInfo });

    return finalInfo;
  }

  private constructTransaction = (
    utxos: ClaimDetails[],
    destinationScript: Buffer,
    fee: number
  ) =>
    targetFee(fee, absoluteFee =>
      constructClaimTransaction(utxos, destinationScript, absoluteFee)
    );

  private broadcastTransaction = async (finalTransaction: Transaction) => {
    this.logger.debug('Final transaction', { finalTransaction });

    const response = await this.boltzService.broadcastTransaction(
      finalTransaction.toHex()
    );

    this.logger.debug('Response from Boltz', { response });

    if (!response?.id) {
      this.logger.error('Did not receive a transaction id from Boltz');
      throw new Error('NoTransactionIdFromBoltz');
    }

    return response.id;
  };
}
