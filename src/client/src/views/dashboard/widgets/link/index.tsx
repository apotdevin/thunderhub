import { Button } from '@/components/ui/button';
import { Link } from '../../../../components/link/Link';

export const DashSettingsLink = () => {
  return (
    <div className="w-full overflow-hidden">
      <Link href={'/settings/dashboard'}>
        <Button variant="outline" className="w-full">
          Dash Settings
        </Button>
      </Link>
    </div>
  );
};

export const ForwardsViewLink = () => {
  return (
    <div className="w-full overflow-hidden">
      <Link href={'/forwards'}>
        <Button variant="outline" className="w-full">
          Forwards
        </Button>
      </Link>
    </div>
  );
};

export const TransactionsViewLink = () => {
  return (
    <div className="w-full overflow-hidden">
      <Link href={'/transactions'}>
        <Button variant="outline" className="w-full">
          Transactions
        </Button>
      </Link>
    </div>
  );
};

export const ChannelViewLink = () => {
  return (
    <div className="w-full overflow-hidden">
      <Link href={'/channels'}>
        <Button variant="outline" className="w-full">
          Channels
        </Button>
      </Link>
    </div>
  );
};
