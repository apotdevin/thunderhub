import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import dynamic from 'next/dynamic';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { SimpleWrapper } from '../src/components/gridWrapper/GridWrapper';
import styled from 'styled-components';

const S = {
  wrapper: styled.div`
    position: relative;
  `,
};

const LoadingComp = () => <LoadingCard noCard={true} loadingHeight={'90vh'} />;

const Dashboard = dynamic(() => import('../src/views/dashboard'), {
  ssr: false,
  loading: LoadingComp,
});

const Wrapped = () => {
  return (
    <SimpleWrapper>
      <S.wrapper>
        <Dashboard />
      </S.wrapper>
    </SimpleWrapper>
  );
};

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
