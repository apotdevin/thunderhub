import { Card, CardContent } from '@/components/ui/card';
import { SignMessageCard } from './SignMessage';
import { VerifyMessage } from './VerifyMessage';

export const MessagesView = () => (
  <div className="flex flex-col gap-4">
    <h2 className="text-lg font-semibold">Messages</h2>
    <Card>
      <CardContent>
        <div className="divide-y divide-border">
          <div className="pb-3">
            <VerifyMessage />
          </div>
          <div className="pt-3">
            <SignMessageCard />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
