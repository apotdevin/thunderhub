import { FC } from 'react';
import { toast } from 'react-toastify';
import { ProgressBar } from 'src/components/generic/CardGeneric';
import { SingleLine } from 'src/components/generic/Styled';
import { getPrice } from 'src/components/price/Price';
import { Table } from 'src/components/table';
import { useConfigState } from 'src/context/ConfigContext';
import { usePriceState } from 'src/context/PriceContext';
import { useGetForwardsPastDaysQuery } from 'src/graphql/queries/__generated__/getForwardsPastDays.generated';
import { Forward } from 'src/graphql/types';
import { getErrorContent } from 'src/utils/error';
import { ReportType } from '../home/reports/forwardReport/ForwardReport';
import { sortByNode } from './helpers';

const getBar = (top: number, bottom: number) => {
  const percent = (top / bottom) * 100;
  return Math.min(percent, 100);
};

const SingleBar = ({ value, height }: { value: number; height: number }) => {
  const opposite = 100 - value;

  return (
    <SingleLine>
      <ProgressBar barHeight={height} order={9} percent={value} />
      <ProgressBar barHeight={height} order={8} percent={opposite} />
    </SingleLine>
  );
};

export const ForwardTable: FC<{ days: number; order: ReportType }> = ({
  days,
  order,
}) => {
  const { data, loading } = useGetForwardsPastDaysQuery({
    ssr: false,
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  if (loading || !data?.getForwardsPastDays?.length) {
    return null;
  }

  const { final, maxIn, maxOut } = sortByNode(
    order,
    data.getForwardsPastDays as Forward[]
  );

  console.log({ final, maxIn, maxOut });

  const columns = [
    { Header: 'Alias', accessor: 'alias' },
    { Header: 'Incoming', accessor: 'incoming' },
    { Header: 'Outgoing', accessor: 'outgoing' },
    { Header: 'Incoming', accessor: 'incomingBar' },
    { Header: 'Outgoing', accessor: 'outgoingBar' },
  ];

  const tableData = final.map(f => ({
    ...f,
    incoming: format({ amount: f.incoming, noUnit: order === 'amount' }),
    outgoing: format({ amount: f.outgoing, noUnit: order === 'amount' }),
    incomingBar: <SingleBar value={getBar(f.incoming, maxIn)} height={16} />,
    outgoingBar: <SingleBar value={getBar(f.outgoing, maxOut)} height={16} />,
  }));

  return <Table tableData={tableData} tableColumns={columns} />;
};
