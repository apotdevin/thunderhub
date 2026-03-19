import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBitcoinFees } from '../../../../hooks/UseBitcoinFees';

export const MempoolReport = () => {
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();

  if (dontShow) {
    return null;
  }

  const fees = [
    { label: 'Fastest', value: fast },
    { label: 'Half Hour', value: halfHour },
    { label: 'Hour', value: hour },
    { label: 'Minimum', value: minimum },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mempool Fees</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {fees.map(fee => (
            <div
              key={fee.label}
              className="flex flex-col items-center gap-0.5 rounded border border-border p-3"
            >
              <span className="text-xs text-muted-foreground">{fee.label}</span>
              <span className="text-sm font-medium font-mono">
                {fee.value} sat/vB
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
