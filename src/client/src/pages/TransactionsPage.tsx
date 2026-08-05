import { useState, useMemo, useCallback, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { InvoiceCard } from '../views/transactions/InvoiceCard';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { Settings, Loader2, Search, X } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { FlowBox } from '../views/home/reports/flow';
import {
  GetInvoicesQuery,
  useGetInvoicesQuery,
} from '../graphql/queries/__generated__/getInvoices.generated';
import {
  GetPaymentsQuery,
  useGetPaymentsQuery,
} from '../graphql/queries/__generated__/getPayments.generated';
import { useGetInvoiceLazyQuery } from '../graphql/queries/__generated__/getInvoice.generated';
import { useGetPaymentLazyQuery } from '../graphql/queries/__generated__/getPayment.generated';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TradeDisplayMode } from '../views/transactions/tradeMemo';

const TransactionsView = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [indexOpen, setIndexOpen] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [graphShow, setGraphShow] = useState('invoices');
  const [graphType, setGraphType] = useState('count');
  const [lookupValue, setLookupValue] = useState('');
  const [lookupOpen, setLookupOpen] = useState(1);

  const [lookupInvoice, invoiceLookup] = useGetInvoiceLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });
  const [lookupPayment, paymentLookup] = useGetPaymentLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const activeLookup = activeTab === 'invoices' ? invoiceLookup : paymentLookup;

  const handleLookupSubmit = (e: FormEvent) => {
    e.preventDefault();
    const id = lookupValue.trim();
    if (!id) return;
    setLookupOpen(1);
    if (activeTab === 'invoices') {
      lookupInvoice({ variables: { id } });
    } else {
      lookupPayment({ variables: { id } });
    }
  };

  const handleLookupClear = () => {
    setLookupValue('');
    invoiceLookup.reset();
    paymentLookup.reset();
  };

  const handleTabChange = (v: string) => {
    if (!v) return;
    setActiveTab(v);
    handleLookupClear();
  };

  const { publicKey } = useNodeInfo();

  const [settings] = useLocalStorage('transactionSettings', defaultSettings);
  const tradeDisplayMode = settings.tradeDisplayMode as TradeDisplayMode;

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
            tradeDisplayMode={tradeDisplayMode}
            key={index}
            index={index + 1}
            setIndexOpen={setIndexOpen}
            indexOpen={indexOpen}
          />
        ))}
      </div>
    );
  }, [invoiceQuery.data, indexOpen, settings, tradeDisplayMode]);

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
            tradeDisplayMode={tradeDisplayMode}
            key={index}
            index={index + 1}
            setIndexOpen={setIndexOpen}
            indexOpen={indexOpen}
          />
        ))}
      </div>
    );
  }, [
    paymentQuery.data,
    indexOpen,
    settings,
    publicKey,
    selfInvoices,
    tradeDisplayMode,
  ]);

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">
          Transactions
          {beforeDate && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {beforeDate}
            </span>
          )}
        </h2>

        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={graphShow}
            onValueChange={v => v && setGraphShow(v)}
          >
            <ToggleGroupItem value="invoices">Invoices</ToggleGroupItem>
            <ToggleGroupItem value="payments">Payments</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={graphType}
            onValueChange={v => v && setGraphType(v)}
          >
            <ToggleGroupItem value="count">Count</ToggleGroupItem>
            <ToggleGroupItem value="tokens">Volume</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <FlowBox show={graphShow} type={graphType} />

      <div className="flex items-center justify-end gap-2">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <ToggleGroupItem value="invoices">Invoices</ToggleGroupItem>
          <ToggleGroupItem value="payments">Payments</ToggleGroupItem>
        </ToggleGroup>
        <Button
          variant={settingsOpen ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setSettingsOpen(p => !p)}
        >
          <Settings size={14} />
        </Button>
      </div>

      <Card>
        <CardContent>
          <form
            onSubmit={handleLookupSubmit}
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={lookupValue}
                onChange={e => setLookupValue(e.target.value)}
                placeholder={
                  activeTab === 'invoices'
                    ? 'Lookup invoice by r-hash (payment hash)'
                    : 'Lookup payment by payment hash'
                }
                className="pl-8 pr-8 font-mono text-xs"
                spellCheck={false}
              />
              {lookupValue && (
                <button
                  type="button"
                  onClick={handleLookupClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={!lookupValue.trim() || activeLookup.loading}
            >
              {activeLookup.loading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                'Lookup'
              )}
            </Button>
          </form>
          {activeLookup.called && !activeLookup.loading && (
            <div className="mt-3">
              {activeTab === 'invoices' && invoiceLookup.data?.getInvoice ? (
                <InvoiceCard
                  invoice={invoiceLookup.data.getInvoice as any}
                  tradeDisplayMode={tradeDisplayMode}
                  index={1}
                  setIndexOpen={setLookupOpen}
                  indexOpen={lookupOpen}
                />
              ) : activeTab === 'payments' && paymentLookup.data?.getPayment ? (
                <PaymentsCard
                  payment={paymentLookup.data.getPayment as any}
                  tradeDisplayMode={tradeDisplayMode}
                  index={1}
                  setIndexOpen={setLookupOpen}
                  indexOpen={lookupOpen}
                />
              ) : activeLookup.error ? (
                <div className="text-center text-sm text-muted-foreground py-3">
                  {activeTab === 'invoices'
                    ? 'No invoice found for that hash.'
                    : 'No payment found for that hash.'}
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {settingsOpen && (
        <Card>
          <CardContent>
            <TransactionSettings />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <div>
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
    </div>
  );
};

const TransactionsPage = () => (
  <GridWrapper centerContent={false}>
    <TransactionsView />
  </GridWrapper>
);

export default TransactionsPage;
