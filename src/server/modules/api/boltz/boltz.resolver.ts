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
  isBoltzError,
} from './boltz.types';
import { getPreimageAndHash } from 'src/server/utils/crypto';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { toWithError } from 'src/server/utils/async';
import { ECPairAPI, ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { mapSeries } from 'async';
import { MempoolService } from '../../mempool/mempool.service';

const ECPair: ECPairAPI = ECPairFactory(ecc);

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
    private mempoolService: MempoolService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => BoltzInfoType)
  async getBoltzInfo() {
    const [info, error] = await toWithError(this.boltzService.getPairs());

    if (error || isBoltzError(info)) {
      this.logger.error('Error getting swap information from Boltz', {
        error,
        boltzError: info,
      });
      throw new GraphQLError('Error getting swap informaion from Boltz');
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
    return mapSeries(ids, async (id: string) => {
      const [info, error] = await toWithError(
        this.boltzService.getSwapStatus(id)
      );

      if (error || isBoltzError(info)) {
        this.logger.error(`Error getting status for swap with id: ${id}`, {
          error,
          boltzError: info,
        });
        return { id };
      }

      if (!info.status) {
        this.logger.debug(
          `No status in Boltz response for swap with id: ${id}`,
          { info }
        );
        return { id };
      }

      return { id, boltz: info };
    });
  }

  @Mutation(() => String)
  async claimBoltzTransaction(
    @Args('id') id: string,
    @Args('redeem') redeem: string,
    @Args('lockupAddress') lockupAddress: string,
    @Args('preimage') preimage: string,
    @Args('privateKey') privateKey: string,
    @Args('destination') destination: string,
    @Args('fee') fee: number
  ) {
    if (!fee || fee < 1) {
      throw new GraphQLError('The fee cannot be below 1 sat/vbyte');
    }

    const [txInfo, txError] = await toWithError(
      this.mempoolService.getAddressTransactions(lockupAddress)
    );

    if (!txInfo?.length || txError) {
      this.logger.error('Error getting lockup address tx information', {
        txInfo,
        txError,
      });
      throw new GraphQLError(
        'Error getting lockup address info. Please try again.'
      );
    }

    this.logger.debug('Lockup address transactions', { txInfo });

    if (txInfo.length > 1) {
      throw new GraphQLError(
        'A claim transaction has already been broadcasted for this swap.'
      );
    }

    const lockupTransactionInfo = txInfo.find(t =>
      t.vout.some(v => v.scriptpubkey_address === lockupAddress)
    );

    if (!lockupTransactionInfo) {
      throw new GraphQLError(
        'Error getting lockup transaction info. Please try again.'
      );
    }

    this.logger.debug('Lockup transaction for lockup address', {
      lockupTransactionInfo,
    });

    const [transactionHex, transactionHexError] = await toWithError(
      this.mempoolService.getTransactionHex(lockupTransactionInfo.txid)
    );

    if (!transactionHex || transactionHexError) {
      this.logger.error('Error getting lockup transaction information', {
        transactionHex,
        transactionHexError,
      });
      throw new GraphQLError(
        'Error getting lockup transaction info. Please try again.'
      );
    }

    this.logger.debug('Found transaction hex for lockup address', {
      transactionHex,
    });

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

    const lockupTransaction = Transaction.fromHex(transactionHex);
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

    const [info, error] = await toWithError(
      this.boltzService.createReverseSwap(amount, hash, publicKey)
    );

    if (error || isBoltzError(info)) {
      this.logger.error('Error creating reverse swap with Boltz', {
        error,
        boltzError: info,
      });
      throw new GraphQLError('Error creating reverse swap with Boltz');
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

    const [info, error] = await toWithError(
      this.boltzService.broadcastTransaction(finalTransaction.toHex())
    );

    if (error || isBoltzError(info)) {
      this.logger.error('Error broadcasting transaction through Boltz', {
        error,
        boltzError: info,
      });
      throw new GraphQLError('Error broadcasting transaction through Boltz');
    }

    if (!info.id) {
      this.logger.error('Did not receive a transaction id from Boltz');
      throw new Error('NoTransactionIdFromBoltz');
    }

    return info.id;
  };
}
