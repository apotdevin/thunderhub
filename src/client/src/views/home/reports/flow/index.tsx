import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TransactionsGraph } from './TransactionGraph';

export interface PeriodProps {
  period: number;
  amount: number;
  tokens: number;
}

export const FlowBox = () => {
  const [show, setShow] = useState('invoices');
  const [type, setType] = useState('count');

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Transactions</CardTitle>
          <div className="flex gap-1.5">
            <ToggleGroup
              type="single"
              value={show}
              onValueChange={v => v && setShow(v)}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="invoices" className="text-xs px-2">
                Invoices
              </ToggleGroupItem>
              <ToggleGroupItem value="payments" className="text-xs px-2">
                Payments
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={v => v && setType(v)}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="count" className="text-xs px-2">
                Count
              </ToggleGroupItem>
              <ToggleGroupItem value="tokens" className="text-xs px-2">
                Volume
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TransactionsGraph showPay={show === 'payments'} type={type} />
      </CardContent>
    </Card>
  );
};
