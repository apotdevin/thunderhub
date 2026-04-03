import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AccountsService } from '../accounts/accounts.service';
import { AuthType, parseSubject } from '../security/security.types';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private accountsService: AccountsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  public async getUserFromAuthToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.sub) {
        const parsed = parseSubject(payload.sub);

        if (parsed.authType === AuthType.USER) {
          return parsed.id;
        }

        const account = this.accountsService.getAccount(parsed.id);

        if (account) {
          return payload.sub;
        }
      }
    } catch {
      this.logger.error('Invalid token for authentication');
    }
  }
}
