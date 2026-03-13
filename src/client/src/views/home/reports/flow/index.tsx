import { useState } from 'react';
import { SmallSelectWithValue } from '../../../../components/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionsGraph } from './TransactionGraph';

export interface PeriodProps {
  period: number;
  amount: number;
  tokens: number;
}

const options = [
  { label: 'Invoices', value: 'invoices' },
  { label: 'Payments', value: 'payments' },
];

const typeOptions = [
  { label: 'Count', value: 'count' },
  { label: 'Volume', value: 'tokens' },
];

export const FlowBox = () => {
  const [show, setShow] = useState(options[0]);
  const [type, setType] = useState(typeOptions[0]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Transactions</CardTitle>
          <div className="flex gap-2">
            <SmallSelectWithValue
              callback={e => setShow((e[0] || options[1]) as any)}
              options={options}
              value={show}
              isClearable={false}
            />
            <SmallSelectWithValue
              callback={e => setType((e[0] || typeOptions[1]) as any)}
              options={typeOptions}
              value={type}
              isClearable={false}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TransactionsGraph
          showPay={show.value === 'payments'}
          type={type.value}
        />
      </CardContent>
    </Card>
  );
};
