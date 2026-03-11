import Table from '../../../../components/table';
import { useBitcoinFees } from '../../../../hooks/UseBitcoinFees';

export const MempoolWidget = () => {
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();

  if (dontShow) {
    return null;
  }

  const columns = [
    { header: 'Fastest', accessorKey: 'fast' },
    { header: 'Half Hour', accessorKey: 'halfHour' },
    { header: 'Hour', accessorKey: 'hour' },
    { header: 'Minimum', accessorKey: 'minimum' },
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
    <div className="w-full overflow-auto">
      <Table alignCenter={true} columns={columns} data={data} />
    </div>
  );
};
