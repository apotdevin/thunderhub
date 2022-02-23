import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { ChevronRight } from 'react-feather';
import styled from 'styled-components';
import { Card } from '../../src/components/generic/CardGeneric';
import {
  CardWithTitle,
  DarkSubTitle,
  SubTitle,
} from '../../src/components/generic/Styled';
import { GridWrapper } from '../../src/components/gridWrapper/GridWrapper';
import { Link } from '../../src/components/link/Link';
import { LoadingCard } from '../../src/components/loading/LoadingCard';
import { CloseChannel } from '../../src/components/modal/closeChannel/CloseChannel';
import { useGetChannelInfoQuery } from '../../src/graphql/queries/__generated__/getChannel.generated';
import { getProps } from '../../src/utils/ssr';
import { ChannelDetails } from '../../src/views/channels/channels/ChannelDetails';

const S = {
  row: styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
  `,
};

const Channel = () => {
  const { query } = useRouter();

  const id = typeof query.slug === 'string' ? query.slug : '';

  const { data, loading, error } = useGetChannelInfoQuery({
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <CardWithTitle>
        <S.row>
          <Link to={'/channels'}>Channels</Link>
          <ChevronRight size={18} />
          <SubTitle>{`${query.slug}`}</SubTitle>
        </S.row>
        <LoadingCard noTitle />
      </CardWithTitle>
    );
  }

  if (!data?.getChannel || error) {
    return (
      <CardWithTitle>
        <S.row>
          <Link to={'/channels'}>Channels</Link>
          <ChevronRight size={18} />
          <SubTitle>{`${query.slug}`}</SubTitle>
        </S.row>
        <Card>
          <DarkSubTitle>
            Error getting channel information. Try refreshing the page.
          </DarkSubTitle>
        </Card>
      </CardWithTitle>
    );
  }

  return (
    <CardWithTitle>
      <S.row>
        <Link to={'/channels'}>Channels</Link>
        <ChevronRight size={18} />
        <SubTitle>{`${query.slug}`}</SubTitle>
      </S.row>
      <Card>
        <ChannelDetails id={id} />
      </Card>
      <Card>
        <CloseChannel
          channelId={id}
          channelName={
            data.getChannel.partner_node_policies?.node?.node?.alias ||
            'Unknown'
          }
        />
      </Card>
    </CardWithTitle>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <Channel />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
