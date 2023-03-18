import { toast } from 'react-toastify';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import {
  Card,
  CardWithTitle,
  SingleLine,
} from '../../../components/generic/Styled';
import { Subtitle } from '../../../components/typography/Styled';
import { useNostrState } from '../../../context/NostrContext';
import { useFollowPeersMutation } from '../../../graphql/mutations/__generated__/followPeers.generated';

export const Follow = () => {
  const [followPeers, {}] = useFollowPeersMutation({
    onCompleted() {
      toast.success('Followed node peers!');
    },
    onError() {
      toast.error("Didn't follow peers");
    },
  });
  const { sec } = useNostrState();
  return (
    <CardWithTitle>
      <Card>
        <SingleLine>
          <Subtitle>Follow Peers</Subtitle>
          <ColorButton
            arrow={false}
            onClick={() => {
              followPeers({ variables: { privateKey: sec } });
            }}
          >
            Follow
          </ColorButton>
        </SingleLine>
      </Card>
    </CardWithTitle>
  );
};
