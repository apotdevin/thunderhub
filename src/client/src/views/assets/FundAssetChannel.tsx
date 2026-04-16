import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFundTapAssetChannelMutation } from '../../graphql/mutations/__generated__/fundTapAssetChannel.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { TapBalanceGroupBy } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';

export const FundAssetChannel: FC = () => {
  const [peerPubkey, setPeerPubkey] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [assetAmount, setAssetAmount] = useState('');
  const [feeRate, setFeeRate] = useState('');
  const [pushSat, setPushSat] = useState('');

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { group_by: TapBalanceGroupBy.GroupKey },
  });

  const knownGroups = (
    balancesData?.taproot_assets?.get_balances?.balances || []
  )
    .filter(b => b.group_key && b.balance && Number(b.balance) > 0)
    .map(b => ({
      groupKey: b.group_key!,
      name: b.names?.[0] || 'Unknown',
      balance: b.balance!,
    }));

  const selectedBalance = knownGroups.find(
    g => g.groupKey === selectedGroup
  )?.balance;

  const [fundChannel, { loading }] = useFundTapAssetChannelMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      const txid = data.taproot_assets?.fund_asset_channel?.txid;
      toast.success(`Asset channel funded! TX: ${txid?.slice(0, 16)}...`);
      setPeerPubkey('');
      setAssetAmount('');
      setFeeRate('');
      setPushSat('');
    },
    refetchQueries: ['GetTapBalances'],
  });

  const handleFund = () => {
    if (!peerPubkey || !selectedGroup || !assetAmount) {
      toast.error('Peer pubkey, asset group, and amount are required');
      return;
    }
    fundChannel({
      variables: {
        input: {
          peer_pubkey: peerPubkey,
          asset_amount: assetAmount,
          group_key: selectedGroup,
          fee_rate_sat_per_vbyte: feeRate ? parseInt(feeRate, 10) : undefined,
          push_sat: pushSat ? parseInt(pushSat, 10) : undefined,
        },
      },
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-3">Open Asset Channel</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Peer Public Key
            </label>
            <input
              type="text"
              value={peerPubkey}
              onChange={e => setPeerPubkey(e.target.value)}
              placeholder="Peer pubkey (hex)"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Asset Group
            </label>
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select a group...</option>
              {knownGroups.map(g => (
                <option key={g.groupKey} value={g.groupKey}>
                  {g.name} (balance: {g.balance})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Asset Amount
              {selectedBalance && (
                <span className="ml-1">(max: {selectedBalance})</span>
              )}
            </label>
            <input
              type="number"
              value={assetAmount}
              onChange={e => setAssetAmount(e.target.value)}
              placeholder="Amount of assets to commit"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Fee Rate (sat/vB)
              <span className="ml-1 text-muted-foreground/60">(optional)</span>
            </label>
            <input
              type="number"
              value={feeRate}
              onChange={e => setFeeRate(e.target.value)}
              placeholder="Leave empty for default"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Push Sats
              <span className="ml-1 text-muted-foreground/60">(optional)</span>
            </label>
            <input
              type="number"
              value={pushSat}
              onChange={e => setPushSat(e.target.value)}
              placeholder="Sats to push to peer"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <Button
            onClick={handleFund}
            disabled={loading || !peerPubkey || !selectedGroup || !assetAmount}
            size="sm"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Open Asset Channel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
