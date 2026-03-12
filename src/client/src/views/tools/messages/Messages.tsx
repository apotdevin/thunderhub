import {
  CardWithTitle,
  SubTitle,
  Card,
} from '../../../components/generic/Styled';
import { SignMessageCard } from './SignMessage';
import { VerifyMessage } from './VerifyMessage';

export const NoWrap = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mr-4 whitespace-nowrap ${className ?? ''}`} {...props}>
    {children}
  </div>
);

export const MessagesView = () => {
  return (
    <CardWithTitle>
      <SubTitle>Messages</SubTitle>
      <Card>
        <VerifyMessage />
        <SignMessageCard />
      </Card>
    </CardWithTitle>
  );
};
