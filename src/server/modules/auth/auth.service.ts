import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrincipalService } from '../principal/principal.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly principalService: PrincipalService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  /**
   * The SSE channels a session cookie may listen on: one per node the
   * principal can open. Empty when the token is invalid or unknown.
   */
  public async getSseChannelsFromAuthToken(token: string): Promise<string[]> {
    try {
      const payload = this.jwtService.verify(token);
      if (!payload?.sub) return [];

      const principal = this.principalService.fromSubject(payload.sub);
      if (!(await this.principalService.exists(principal))) return [];

      const nodes = await this.principalService.getNodes(principal);
      const channels = nodes.map(node => node.hash);

      return channels.length ? channels : [principal.id];
    } catch {
      this.logger.error('Invalid token for authentication');
      return [];
    }
  }
}
