import { useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
        <div className="flex justify-start items-center">
          <Link to={'/channels'}>Channels</Link>
          <ChevronRight size={18} />
          <SubTitle>{slug}</SubTitle>
        </div>
        <LoadingCard noTitle />
      </CardWithTitle>
    );
  }

  if (!data?.getChannel || error) {
    return (
      <CardWithTitle>
        <div className="flex justify-start items-center">
          <Link to={'/channels'}>Channels</Link>
          <ChevronRight size={18} />
          <SubTitle>{slug}</SubTitle>
        </div>
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
      <div className="flex justify-start items-center">
        <Link to={'/channels'}>Channels</Link>
        <ChevronRight size={18} />
        <SubTitle>{slug}</SubTitle>
      </div>
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
