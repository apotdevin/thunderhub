import { Zap, Anchor, Pocket } from 'lucide-react';
import { useNodeBalances } from '../../../hooks/UseNodeBalances';
import Big from 'big.js';
import { Price } from '../../../components/price/Price';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const StatItem = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between md:flex-col md:items-end md:gap-0.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium font-mono">{children}</span>
  </div>
);

export const AccountInfo = () => {
  const { onchain, lightning } = useNodeBalances();

  const totalAmount = new Big(onchain.confirmed)
    .add(onchain.pending)
    .add(onchain.closing)
    .add(lightning.confirmed)
    .add(lightning.pending)
    .toString();

  const totalChain = new Big(onchain.confirmed).add(onchain.pending).toString();
  const totalLightning = new Big(lightning.confirmed)
    .add(lightning.pending)
    .toString();

  const activeLightning = new Big(lightning.active)
    .sub(lightning.commit)
    .toString();

  const inactiveLightning = new Big(lightning.confirmed)
    .sub(lightning.active)
    .add(lightning.commit)
    .toString();

  const chainPending = Number(onchain.pending) + Number(onchain.closing);
  const channelPending = Number(lightning.pending);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Pocket
              size={16}
              className={
                chainPending === 0 && channelPending === 0
                  ? 'text-green-500'
                  : 'text-purple-500'
              }
            />
            <CardTitle>Balance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatItem label="Total">
              <Price amount={totalAmount} />
            </StatItem>
            <StatItem label="Bitcoin">
              <Price amount={totalChain} />
            </StatItem>
            <StatItem label="Lightning">
              <Price amount={totalLightning} />
            </StatItem>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap
                size={16}
                className={
                  channelPending === 0 ? 'text-yellow-500' : 'text-purple-500'
                }
              />
              <CardTitle>Lightning</CardTitle>
            </div>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span className="font-mono">
                  <Price amount={activeLightning} />
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Not Available</span>
                <span className="font-mono">
                  <Price amount={inactiveLightning} />
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-mono">
                  <Price amount={lightning.pending} />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Anchor
                size={16}
                className={
                  chainPending === 0 ? 'text-yellow-500' : 'text-purple-500'
                }
              />
              <CardTitle>Bitcoin</CardTitle>
            </div>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available</span>
                <span className="font-mono">
                  <Price amount={onchain.confirmed} />
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-mono">
                  <Price amount={onchain.pending} />
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Force Closures</span>
                <span className="font-mono">
                  <Price amount={onchain.closing} />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
