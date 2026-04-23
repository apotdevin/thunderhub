import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TapWithdrawStep } from '../home/quickActions/exchange/TapWithdrawStep';

export const SendAsset: FC = () => (
  <Card>
    <CardContent className="p-4">
      <h3 className="text-sm font-semibold mb-3">Send Asset</h3>
      <TapWithdrawStep />
    </CardContent>
  </Card>
);
