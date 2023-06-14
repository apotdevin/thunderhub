import TableV2 from '../../../../components/table-v2';
import { useBitcoinFees } from '../../../../hooks/UseBitcoinFees';
import styled from 'styled-components';

const S = {
  wrapper: styled.div`
    width: 100%;
    overflow: auto;
  `,
};

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
    <S.wrapper>
      <TableV2 alignCenter={true} columns={columns} data={data} />
    </S.wrapper>
  );
};
