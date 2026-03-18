import { NodeType } from '../node/lightning.types';
import { ParsedAccount } from '../files/files.types';

export type EnrichedAccount = {
  type: NodeType;
  connection: any;
} & ParsedAccount;
