import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private accountsService: AccountsService
  ) {}

  public async getUserFromAuthToken(token: string) {
    const payload = this.jwtService.verify(token);

    if (payload.sub) {
      const account = this.accountsService.getAccount(payload.sub);

      if (account) {
        return payload.sub;
      }
    }
  }
}
