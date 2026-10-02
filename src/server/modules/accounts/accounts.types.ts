import { NodeType } from '../node/lightning.types';
import { ParsedAccount } from '../files/files.types';

export type EnrichedAccount = {
  type: NodeType;
  connection: any;
  /** Where the node came from: the YAML account file or the database. */
  source: 'yaml' | 'db';
} & ParsedAccount;
