import { LndObject } from 'server/types/ln-service.types';

export class SavedLnd {
  hash: string | null;
  lnd: LndObject | null;

  constructor() {
    this.hash = null;
    this.lnd = null;
  }

  save(hash: string, lnd: LndObject) {
    this.hash = hash;
    this.lnd = lnd;
  }

  reset() {
    this.hash = null;
    this.lnd = null;
  }

  isSame(hash: string): boolean {
    if (hash === this.hash && this.lnd) {
      return true;
    }
    return false;
  }
}
