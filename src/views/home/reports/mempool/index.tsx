import { Card, CardWithTitle, SubTitle } from 'src/components/generic/Styled';
import { Table } from 'src/components/table';
import { useBitcoinFees } from 'src/hooks/UseBitcoinFees';

export const MempoolReport = () => {
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();

  if (dontShow) {
    return null;
  }

  const columns = [
    { Header: 'Fastest', accessor: 'fast' },
    { Header: 'Half Hour', accessor: 'halfHour' },
    { Header: 'Hour', accessor: 'hour' },
    { Header: 'Minimum', accessor: 'minimum' },
  ];

  const data = [
    {
      fast: `${fast} sat/vB`,
      halfHour: `${halfHour} sat/vB`,
      hour: `${hour} sat/vB`,
      minimum: `${minimum} sat/vB`,
    },
  ];

  return (
    <CardWithTitle>
      <SubTitle>Mempool Fees</SubTitle>
      <Card>
        <Table alignCenter={true} tableColumns={columns} tableData={data} />
      </Card>
    </CardWithTitle>
  );
};
