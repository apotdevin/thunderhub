import {
  Card,
  CardWithTitle,
  SubTitle,
} from '../../../../components/generic/Styled';
import TableV2 from '../../../../components/table-v2';
import { useBitcoinFees } from '../../../../hooks/UseBitcoinFees';

export const MempoolReport = () => {
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();

  if (dontShow) {
    return null;
  }

  const columns = [
    {
      header: 'Fastest',
      accessorKey: 'fast',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: 'Half Hour',
      accessorKey: 'halfHour',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: 'Hour',
      accessorKey: 'hour',
      cell: ({ cell }: any) => cell.renderValue(),
    },
    {
      header: 'Minimum',
      accessorKey: 'minimum',
      cell: ({ cell }: any) => cell.renderValue(),
    },
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
        <TableV2 alignCenter={true} columns={columns} data={data} />
      </Card>
    </CardWithTitle>
  );
};
