import {
  CardWithTitle,
  SubTitle,
  Card,
} from '../../../components/generic/Styled';
import { SignMessageCard } from './SignMessage';
import { VerifyMessage } from './VerifyMessage';
import { MessageSquare } from 'lucide-react';

export const MessagesView = () => (
  <CardWithTitle>
    <div className="flex items-center gap-2 mb-1">
      <MessageSquare size={18} className="text-muted-foreground" />
      <SubTitle>Messages</SubTitle>
    </div>
    <Card bottom="0">
      <div className="divide-y divide-border">
        <div className="pb-3">
          <VerifyMessage />
        </div>
        <div className="pt-3">
          <SignMessageCard />
        </div>
      </div>
    </Card>
  </CardWithTitle>
);
