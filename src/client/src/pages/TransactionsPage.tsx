import { useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { InvoiceCard } from '../views/transactions/InvoiceCard';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { Settings, Loader2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/UseLocalStorage';
import { useNodeInfo } from '../hooks/UseNodeInfo';
import {
  defaultSettings,
  TransactionSettings,
} from '../views/transactions/Settings';
import { format } from 'date-fns';
import { getErrorContent } from '../utils/error';
import { PaymentsCard } from '../views/transactions/PaymentsCards';
import { Button } from '@/components/ui/button';
import { FlowBox } from '../views/home/reports/flow';
import {
  GetInvoicesQuery,
  useGetInvoicesQuery,
} from '../graphql/queries/__generated__/getInvoices.generated';
import {
  GetPaymentsQuery,
  useGetPaymentsQuery,
} from '../graphql/queries/__generated__/getPayments.generated';
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';

const TransactionsView = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [indexOpen, setIndexOpen] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { publicKey } = useNodeInfo();

  const [settings] = useLocalStorage('transactionSettings', defaultSettings);

  const invoiceQuery = useGetInvoicesQuery({
    notifyOnNetworkStatusChange: true,
    onError: error => toast.error(getErrorContent(error)),
  });
  const paymentQuery = useGetPaymentsQuery({
    notifyOnNetworkStatusChange: true,
    onError: error => toast.error(getErrorContent(error)),
  });

  const isLoading =
    invoiceQuery.networkStatus === 1 || paymentQuery.networkStatus === 1;
  const isRefetching =
    invoiceQuery.networkStatus === 3 || paymentQuery.networkStatus === 3;

  const loadingOrRefetching = isLoading || isRefetching;

  const selfInvoices: string[] = useMemo(() => {
    const payments = paymentQuery.data?.getPayments.payments || [];
    return payments.reduce((p, c) => {
      if (!c) return p;
      if (c.destination === publicKey) {
        return [...p, c.id];
      }
      return p;
    }, [] as string[]);
  }, [paymentQuery.data, publicKey]);

  const beforeDate = useMemo(() => {
    const invoices = invoiceQuery.data?.getInvoices.invoices || [];
    const payments = paymentQuery.data?.getPayments.payments || [];

    const lastInvoice = invoices[invoices.length - 1]?.created_at;
    const lastPayment = payments[payments.length - 1]?.created_at;

    if (activeTab === 'invoices') {
      if (lastInvoice) {
        return `${format(new Date(lastInvoice), 'dd/MM/yy')} - Today`;
      }
      return '';
    }

    if (activeTab === 'payments') {
      if (lastPayment) {
        return `${format(new Date(lastPayment), 'dd/MM/yy')} - Today`;
      }
      return '';
    }
  }, [invoiceQuery.data, paymentQuery.data, activeTab]);

  const renderInvoices = useCallback(() => {
    const list = invoiceQuery.data?.getInvoices.invoices || [];
    if (!list.length) {
      return (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No invoices found
        </div>
      );
    }

    const filtered = list.reduce(
      (p, c) => {
        const { confirmed } = settings;
        if (!c) return p;
        if (confirmed && !c.is_confirmed) return p;
        return [...p, c];
      },
      [] as GetInvoicesQuery['getInvoices']['invoices']
    );

    if (!filtered.length) {
      return (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No matching invoices
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {filtered.map((i, index) => (
          <InvoiceCard
            invoice={i as any}
            key={index}
            index={index + 1}
            setIndexOpen={setIndexOpen}
            indexOpen={indexOpen}
          />
        ))}
      </div>
    );
  }, [invoiceQuery.data, indexOpen, settings]);

  const renderPayments = useCallback(() => {
    const list = paymentQuery.data?.getPayments.payments || [];

    if (!list.length) {
      return (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No payments found
        </div>
      );
    }

    const filtered = list.reduce(
      (p, c) => {
        const { rebalance, confirmed } = settings;
        if (!c) return p;
        if (rebalance) {
          if (c.destination === publicKey) return p;
          if (selfInvoices.includes(c.id)) return p;
        }
        if (confirmed && !c.is_confirmed) return p;
        return [...p, c];
      },
      [] as GetPaymentsQuery['getPayments']['payments']
    );

    if (!filtered.length) {
      return (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No matching payments
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {filtered.map((i, index) => (
          <PaymentsCard
            payment={i}
            key={index}
            index={index + 1}
            setIndexOpen={setIndexOpen}
            indexOpen={indexOpen}
          />
        ))}
      </div>
    );
  }, [paymentQuery.data, indexOpen, settings, publicKey, selfInvoices]);

  const isDisabled = useMemo(() => {
    if (activeTab === 'invoices') {
      return !invoiceQuery.data?.getInvoices.next;
    }
    return !paymentQuery.data?.getPayments.next;
  }, [invoiceQuery.data, paymentQuery.data, activeTab]);

  const handleClick = () => {
    if (activeTab === 'invoices') {
      const token = invoiceQuery.data?.getInvoices.next;
      if (!token) return;
      invoiceQuery.fetchMore({ variables: { token } });
    } else {
      const token = paymentQuery.data?.getPayments.next;
      if (!token) return;
      paymentQuery.fetchMore({ variables: { token } });
    }
  };

  return (
    <>
      <FlowBox />
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            Transactions
            {beforeDate && (
              <span className="text-xs font-normal text-muted-foreground">
                {beforeDate}
              </span>
            )}
          </CardTitle>
          <CardAction>
            <Button
              variant={settingsOpen ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSettingsOpen(p => !p)}
            >
              <Settings size={14} />
            </Button>
          </CardAction>
        </CardHeader>
        {settingsOpen && (
          <>
            <CardContent>
              <TransactionSettings />
            </CardContent>
            <Separator />
          </>
        )}
        <CardContent>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={activeTab}
            onValueChange={v => v && setActiveTab(v)}
          >
            <ToggleGroupItem value="invoices">Invoices</ToggleGroupItem>
            <ToggleGroupItem value="payments">Payments</ToggleGroupItem>
          </ToggleGroup>
          <div className="mt-3">
            {activeTab === 'invoices' ? renderInvoices() : renderPayments()}
          </div>
        </CardContent>
        {!isDisabled && (
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              disabled={loadingOrRefetching}
              onClick={() => handleClick()}
            >
              {loadingOrRefetching ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                'Load More'
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </>
  );
};

const TransactionsPage = () => (
  <GridWrapper>
    <TransactionsView />
  </GridWrapper>
);

export default TransactionsPage;
