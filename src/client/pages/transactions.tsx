import React, { useState, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { InvoiceCard } from '../src/views/transactions/InvoiceCard';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { Settings } from 'react-feather';
import styled from 'styled-components';
import { useLocalStorage } from '../src/hooks/UseLocalStorage';
import { useNodeInfo } from '../src/hooks/UseNodeInfo';
import {
  defaultSettings,
  TransactionSettings,
} from '../src/views/transactions/Settings';
import { format } from 'date-fns';
import {
  Card,
  CardWithTitle,
  SubTitle,
  DarkSubTitle,
} from '../src/components/generic/Styled';
import { getErrorContent } from '../src/utils/error';
import { PaymentsCard } from '../src/views/transactions/PaymentsCards';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';
import { FlowBox } from '../src/views/home/reports/flow';
import {
  GetInvoicesQuery,
  useGetInvoicesQuery,
} from '../src/graphql/queries/__generated__/getInvoices.generated';
import {
  GetPaymentsQuery,
  useGetPaymentsQuery,
} from '../src/graphql/queries/__generated__/getPayments.generated';
import { SmallSelectWithValue } from '../src/components/select';

const S = {
  row: styled.div`
    width: 100%;
    display: grid;
    column-gap: 16px;
    grid-template-columns: 1fr 110px 50px;
    margin-bottom: 8px;
    align-items: center;
  `,
};

const options = [
  { label: 'Invoices', value: 'invoices' },
  { label: 'Payments', value: 'payments' },
];

const TransactionsView = () => {
  const [show, setShow] = useState(options[0]);
  const [indexOpen, setIndexOpen] = useState(0);

  const [open, setOpen] = useState<boolean>(false);

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

    if (show.value === 'invoices') {
      if (lastInvoice) {
        const date = new Date(lastInvoice);
        return `${format(date, 'dd/MM/yy')} -> Today`;
      } else {
        return '';
      }
    }

    if (show.value === 'payments') {
      if (lastPayment) {
        const date = new Date(lastPayment);
        return `${format(date, 'dd/MM/yy')} -> Today`;
      } else {
        return '';
      }
    }
  }, [invoiceQuery.data, paymentQuery.data, show]);

  const renderInvoices = useCallback(() => {
    const list = invoiceQuery.data?.getInvoices.invoices || [];
    if (!list.length) {
      return null;
    }

    const filtered = list.reduce(
      (p, c) => {
        const { confirmed } = settings;

        if (!c) return p;

        if (confirmed) {
          if (!c.is_confirmed) {
            return p;
          }
        }

        return [...p, c];
      },
      [] as GetInvoicesQuery['getInvoices']['invoices']
    );

    return (
      <>
        {filtered.map((i, index) => (
          <InvoiceCard
            invoice={i as any}
            key={index}
            index={index + 1}
            setIndexOpen={setIndexOpen}
            indexOpen={indexOpen}
          />
        ))}
      </>
    );
  }, [invoiceQuery.data, indexOpen, settings]);

  const renderPayments = useCallback(() => {
    const list = paymentQuery.data?.getPayments.payments || [];

    if (!list.length) {
      return null;
    }

    const filtered = list.reduce(
      (p, c) => {
        const { rebalance, confirmed } = settings;

        if (!c) return p;

        if (rebalance) {
          if (c.destination === publicKey) {
            return p;
          }
          if (selfInvoices.includes(c.id)) {
            return p;
          }
        }

        if (confirmed) {
          if (!c.is_confirmed) {
            return p;
          }
        }

        return [...p, c];
      },
      [] as GetPaymentsQuery['getPayments']['payments']
    );

    return (
      <>
        {filtered.map((i, index) => (
          <PaymentsCard
            payment={i}
            key={index}
            index={index + 1}
            setIndexOpen={setIndexOpen}
            indexOpen={indexOpen}
          />
        ))}
      </>
    );
  }, [paymentQuery.data, indexOpen, settings, publicKey, selfInvoices]);

  const isDisabled = useMemo(() => {
    if (show.value === 'invoices') {
      if (!invoiceQuery.data?.getInvoices.next) {
        return true;
      }
    } else {
      if (!paymentQuery.data?.getPayments.next) {
        return true;
      }
    }
    return false;
  }, [invoiceQuery.data, paymentQuery.data, show]);

  const handleClick = () => {
    if (show.value === 'invoices') {
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
      <CardWithTitle>
        <S.row>
          <SubTitle>
            Transactions
            <DarkSubTitle fontSize={'12px'}>{beforeDate}</DarkSubTitle>
          </SubTitle>
          <SmallSelectWithValue
            callback={e => setShow((e[0] || options[1]) as any)}
            options={options}
            value={show}
            isClearable={false}
          />
          <ColorButton
            onClick={() => {
              setOpen(p => !p);
            }}
          >
            <Settings size={18} />
          </ColorButton>
        </S.row>
        {open && (
          <Card>
            <TransactionSettings />
          </Card>
        )}
        <Card bottom={'8px'} mobileCardPadding={'0'} mobileNoBackground={true}>
          {show.value === 'invoices' ? renderInvoices() : renderPayments()}
          {isDisabled ? null : (
            <ColorButton
              loading={loadingOrRefetching}
              disabled={loadingOrRefetching}
              fullWidth={true}
              withMargin={'16px 0 0'}
              onClick={() => handleClick()}
            >
              Fetch More
            </ColorButton>
          )}
        </Card>
      </CardWithTitle>
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <TransactionsView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
