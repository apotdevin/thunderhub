import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TransactionsGraph } from './TransactionGraph';

export interface PeriodProps {
  period: number;
  amount: number;
  tokens: number;
}

export const FlowBox = ({
  show: controlledShow,
  type: controlledType,
}: {
  show?: string;
  type?: string;
} = {}) => {
  const [localShow, setLocalShow] = useState('invoices');
  const [localType, setLocalType] = useState('count');

  const show = controlledShow ?? localShow;
  const type = controlledType ?? localType;
  const isControlled = controlledShow !== undefined;

  return (
    <Card>
      {!isControlled && (
        <div className="flex gap-1.5 px-5 pt-5">
          <ToggleGroup
            type="single"
            value={show}
            onValueChange={v => v && setLocalShow(v)}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem
              value="invoices"
              className="text-xs px-2 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
            >
              Invoices
            </ToggleGroupItem>
            <ToggleGroupItem
              value="payments"
              className="text-xs px-2 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
            >
              Payments
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            value={type}
            onValueChange={v => v && setLocalType(v)}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem
              value="count"
              className="text-xs px-2 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
            >
              Count
            </ToggleGroupItem>
            <ToggleGroupItem
              value="tokens"
              className="text-xs px-2 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
            >
              Volume
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
      <CardContent>
        <TransactionsGraph showPay={show === 'payments'} type={type} />
      </CardContent>
    </Card>
  );
};
