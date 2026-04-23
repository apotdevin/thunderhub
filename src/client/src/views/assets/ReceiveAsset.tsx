import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TapDepositStep } from '../home/quickActions/exchange/TapDepositStep';

export const ReceiveAsset: FC = () => (
  <Card>
    <CardContent className="p-4">
      <h3 className="text-sm font-semibold mb-3">Receive Asset</h3>
      <TapDepositStep />
    </CardContent>
  </Card>
);
