import { useParams } from 'react-router-dom';
import { ChevronRight } from 'react-feather';
import styled from 'styled-components';
import { Card } from '../components/generic/CardGeneric';
import {
  CardWithTitle,
  DarkSubTitle,
  SubTitle,
} from '../components/generic/Styled';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { Link } from '../components/link/Link';
import { LoadingCard } from '../components/loading/LoadingCard';
import { CloseChannel } from '../components/modal/closeChannel/CloseChannel';
import { useGetChannelInfoQuery } from '../graphql/queries/__generated__/getChannel.generated';
import { ChannelDetails } from '../views/channels/channels/ChannelDetails';

const S = {
  row: styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
  `,
};

const Channel = () => {
  const { slug } = useParams<{ slug: string }>();

  const id = slug || '';

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
          <SubTitle>{slug}</SubTitle>
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
          <SubTitle>{slug}</SubTitle>
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
        <SubTitle>{slug}</SubTitle>
      </S.row>
      <Card>
        <ChannelDetails
          id={id}
          name={
            data.getChannel.partner_node_policies?.node?.node?.alias ||
            'Unknown'
          }
        />
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

const ChannelDetailPage = () => (
  <GridWrapper>
    <Channel />
  </GridWrapper>
);

export default ChannelDetailPage;
