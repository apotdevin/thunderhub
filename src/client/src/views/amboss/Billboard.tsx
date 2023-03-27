import { ChatInput } from '../chat/ChatInput';
import {
  Card,
  CardWithTitle,
  SubTitle,
  Separation,
} from '../../components/generic/Styled';
import { Text } from '../../components/typography/Styled';

export const Billboard = () => {
  return (
    <CardWithTitle>
      <SubTitle>Keysend Billboard</SubTitle>
      <Card>
        <Text>
          Keysend Amboss a message and it will appear on the home page! Messages
          are sorted by amount of sats sent and how recent it was.
        </Text>
        <Separation />
        <ChatInput
          alias={'Amboss.Space'}
          sender={
            '03006fcf3312dae8d068ea297f58e2bd00ec1ffe214b793eda46966b6294a53ce6'
          }
        />
      </Card>
    </CardWithTitle>
  );
};
