import { useState } from 'react';
import { SmallSelectWithValue } from '../../../../components/select';
import {
  CardWithTitle,
  SubTitle,
  Card,
  CardTitle,
} from '../../../../components/generic/Styled';
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

  const Header = () => {
    return (
      <CardTitle>
        <div className="w-full flex justify-between mb-2 flex-col md:flex-row">
          <SubTitle>Transactions</SubTitle>

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
      </CardTitle>
    );
  };

  return (
    <CardWithTitle>
      <Header />
      <Card bottom={'10px'} mobileCardPadding={'8px 0'}>
        <TransactionsGraph
          showPay={show.value === 'payments'}
          type={type.value}
        />
      </Card>
    </CardWithTitle>
  );
};
