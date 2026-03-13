import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { ForwardChannelsReport, BreakdownType } from './ForwardChannelReport';
import { ArrowDown, ArrowUp, GitCommit } from 'lucide-react';
import { ForwardResume } from './ForwardResume';
import { ForwardsGraph } from './ForwardsGraph';

export const CardContentLayout = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex h-full flex-col px-2 md:px-4 ${className ?? ''}`}
    {...props}
  >
    {children}
  </div>
);

const dayOptions = [
  { label: '1D', value: 1 },
  { label: '7D', value: 7 },
  { label: '1M', value: 30 },
  { label: '2M', value: 60 },
  { label: '6M', value: 180 },
];

const typeOptions = [
  { label: 'Count', value: 'count' },
  { label: 'Amount', value: 'tokens' },
  { label: 'Fees', value: 'fee' },
];

export { dayOptions as options, typeOptions };

export const ForwardBox = () => {
  const [days, setDays] = useState(dayOptions[0]);
  const [type, setType] = useState(typeOptions[0]);
  const [breakdownType, setBreakdownType] = useState<BreakdownType>('incoming');

  return (
    <div className="flex flex-col gap-4">
      {/* Summary + Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Forwards</CardTitle>
            <div className="flex gap-1.5">
              <ToggleGroup
                type="single"
                value={String(days.value)}
                onValueChange={v => {
                  const opt = dayOptions.find(d => String(d.value) === v);
                  if (opt) setDays(opt);
                }}
                variant="outline"
                size="sm"
              >
                {dayOptions.map(opt => (
                  <ToggleGroupItem
                    key={opt.value}
                    value={String(opt.value)}
                    className="text-xs px-1.5"
                  >
                    {opt.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <ToggleGroup
                type="single"
                value={type.value}
                onValueChange={v => {
                  const opt = typeOptions.find(t => t.value === v);
                  if (opt) setType(opt);
                }}
                variant="outline"
                size="sm"
              >
                {typeOptions.map(opt => (
                  <ToggleGroupItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs px-2"
                  >
                    {opt.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <ForwardResume type={type} />
        </CardContent>
        <Separator />
        <CardContent>
          <ForwardsGraph days={days} type={type} />
        </CardContent>
      </Card>

      {/* Forwards breakdown */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Forwards Breakdown</CardTitle>
            <ToggleGroup
              type="single"
              value={breakdownType}
              onValueChange={v => {
                if (v) setBreakdownType(v as BreakdownType);
              }}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="incoming" className="text-xs px-2">
                <ArrowDown className="size-3 mr-1" />
                Incoming
              </ToggleGroupItem>
              <ToggleGroupItem value="route" className="text-xs px-2">
                <GitCommit className="size-3 mr-1" />
                Routes
              </ToggleGroupItem>
              <ToggleGroupItem value="outgoing" className="text-xs px-2">
                <ArrowUp className="size-3 mr-1" />
                Outgoing
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent>
          <ForwardChannelsReport days={days.value} type={breakdownType} />
        </CardContent>
      </Card>
    </div>
  );
};
