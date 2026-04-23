import { useMemo, useState } from 'react';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useNodeSlug, useNodePath } from '../hooks/useNodeSlug';
import { useNodeInfo } from '../hooks/UseNodeInfo';
import {
  MagmaOrders,
  useMagmaOrders,
  STATUS_LABELS,
  MagmaTab,
} from '../views/channels/magmaOrders/MagmaOrders';

const tabs: { value: MagmaTab; label: string }[] = [
  { value: 'purchases', label: 'Purchases' },
  { value: 'sales', label: 'Sales' },
];

const tabRoutes: Record<MagmaTab, string> = {
  purchases: '/magma',
  sales: '/magma/sales',
};

const routeToTab = (path: string): MagmaTab => {
  if (path === '/magma/sales') return 'sales';
  return 'purchases';
};

const MagmaView = () => {
  const { navigateToNode } = useNodeSlug();
  const nodePath = useNodePath();
  const activeTab = routeToTab(nodePath);
  const { purchases, sales } = useMagmaOrders();
  const { publicKey, alias } = useNodeInfo();
  const [statusFilter, setStatusFilter] = useState('all');
  const [nodeFilter, setNodeFilter] = useState<string | null>(null);

  const effectiveNodeFilter = (nodeFilter ?? publicKey) || 'all';

  const nodes = useMemo(() => {
    const map = new Map<string, string>();
    if (publicKey) {
      map.set(publicKey, alias || publicKey.slice(0, 16) + '…');
    }
    for (const o of purchases) {
      if (o.destination?.pubkey && !map.has(o.destination.pubkey)) {
        map.set(
          o.destination.pubkey,
          o.destination.alias || o.destination.pubkey.slice(0, 16) + '…'
        );
      }
    }
    for (const o of sales) {
      if (o.source?.pubkey && !map.has(o.source.pubkey)) {
        map.set(
          o.source.pubkey,
          o.source.alias || o.source.pubkey.slice(0, 16) + '…'
        );
      }
    }
    return map;
  }, [purchases, sales, publicKey, alias]);

  const filteredPurchases = useMemo(() => {
    if (effectiveNodeFilter === 'all') return purchases;
    return purchases.filter(o => o.destination?.pubkey === effectiveNodeFilter);
  }, [purchases, effectiveNodeFilter]);

  const filteredSales = useMemo(() => {
    if (effectiveNodeFilter === 'all') return sales;
    return sales.filter(o => o.source?.pubkey === effectiveNodeFilter);
  }, [sales, effectiveNodeFilter]);

  const counts: Record<MagmaTab, number> = {
    purchases: filteredPurchases.length,
    sales: filteredSales.length,
  };

  const activeOrders =
    activeTab === 'purchases' ? filteredPurchases : filteredSales;

  const statuses = useMemo(() => {
    const unique = [...new Set(activeOrders.map(o => o.status))];
    unique.sort();
    return unique;
  }, [activeOrders]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Magma Orders</h2>

        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={activeTab}
            onValueChange={value => {
              if (value) {
                setStatusFilter('all');
                navigateToNode(tabRoutes[value as MagmaTab]);
              }
            }}
          >
            {tabs.map(tab => (
              <ToggleGroupItem key={tab.value} value={tab.value}>
                {tab.label}
                <Badge
                  variant={activeTab === tab.value ? 'default' : 'secondary'}
                  className="min-w-5 justify-center"
                >
                  {counts[tab.value]}
                </Badge>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Select
            value={effectiveNodeFilter}
            onValueChange={v => {
              setNodeFilter(v);
              setStatusFilter('all');
            }}
          >
            <SelectTrigger className="w-44 h-8 text-xs">
              <SelectValue placeholder="Filter by node" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All nodes</SelectItem>
              {[...nodes.entries()].map(([pubkey, nodeAlias]) => (
                <SelectItem key={pubkey} value={pubkey}>
                  {nodeAlias}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-50 h-8 text-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map(s => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s] ?? s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent>
          <MagmaOrders
            tab={activeTab}
            statusFilter={statusFilter}
            nodeFilter={effectiveNodeFilter}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const MagmaPage = () => (
  <GridWrapper centerContent={false}>
    <MagmaView />
  </GridWrapper>
);

export default MagmaPage;
