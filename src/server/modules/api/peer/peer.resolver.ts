import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { NodeService } from '../../node/node.service';
import { CurrentUser } from '../../security/security.decorators';
import { UserId } from '../../security/security.types';
import { Peer } from './peer.types';

@Resolver()
export class PeerResolver {
  constructor(
    private nodeService: NodeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Query(() => [Peer])
  async getPeers(@CurrentUser() { id }: UserId) {
    const { peers } = await this.nodeService.getPeers(id);

    return peers.map(peer => ({
      ...peer,
      partner_node_info: { publicKey: peer.public_key },
    }));
  }

  @Mutation(() => Boolean)
  async addPeer(
    @Args('url', { nullable: true }) url: string,
    @Args('publicKey', { nullable: true }) publicKey: string,
    @Args('socket', { nullable: true }) socket: string,
    @Args('isTemporary', { nullable: true }) isTemporary: boolean,
    @CurrentUser() { id }: UserId
  ) {
    if (!url && !publicKey && !socket) {
      this.logger.error('Expected public key and socket to connect');
      throw new Error('ExpectedPublicKeyAndSocketToConnect');
    }

    let peerSocket = socket || '';
    let peerPublicKey = publicKey || '';

    if (url) {
      const parts = url.split('@');

      if (parts.length !== 2) {
        this.logger.error(`Wrong url format to connect (${url})`);
        throw new Error('WrongUrlFormatToConnect');
      }

      peerPublicKey = parts[0];
      peerSocket = parts[1];
    }

    await this.nodeService.addPeer(id, peerPublicKey, peerSocket, isTemporary);
    return true;
  }

  @Mutation(() => Boolean)
  async removePeer(
    @Args('publicKey', { nullable: true }) publicKey: string,
    @CurrentUser() { id }: UserId
  ) {
    await this.nodeService.removePeer(id, publicKey);
    return true;
  }
}
