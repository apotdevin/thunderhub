import React, { useState } from 'react';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { TokenCard } from 'src/views/token/TokenCard';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { PaidCard } from 'src/views/token/PaidCard';
import { useBaseState } from 'src/context/BaseContext';
import { Card } from 'src/components/generic/Styled';

const TokenView = () => {
  const { hasToken } = useBaseState();
  const [id, setId] = useState<string | null>();

  if (id) {
    return <PaidCard id={id} />;
  }

  if (hasToken) {
    return <Card>You already have a token!</Card>;
  }

  return <TokenCard paidCallback={id => setId(id)} />;
};

const Wrapped = () => (
  <GridWrapper>
    <TokenView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
