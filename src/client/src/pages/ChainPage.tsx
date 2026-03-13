import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { ChainTransactions } from '../views/chain/transactions/ChainTransactions';
import { ChainUtxos } from '../views/chain/utxos/ChainUtxos';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Coins, ArrowUpDown } from 'lucide-react';

const ChainView = () => (
  <div className="flex flex-col gap-4">
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Coins size={16} />
          UTXOs
        </CardTitle>
        <CardDescription>Unspent transaction outputs</CardDescription>
      </CardHeader>
      <CardContent>
        <ChainUtxos />
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown size={16} />
          Chain Transactions
        </CardTitle>
        <CardDescription>On-chain transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        <ChainTransactions />
      </CardContent>
    </Card>
  </div>
);

const ChainPage = () => (
  <GridWrapper>
    <ChainView />
  </GridWrapper>
);

export default ChainPage;
