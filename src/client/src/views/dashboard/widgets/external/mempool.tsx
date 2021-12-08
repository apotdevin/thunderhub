import { Table } from '../../../../components/table';
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
    <S.wrapper>
      <Table alignCenter={true} tableColumns={columns} tableData={data} />
    </S.wrapper>
  );
};
