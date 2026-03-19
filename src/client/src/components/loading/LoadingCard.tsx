import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingCardProps {
  title?: string;
  noCard?: boolean;
  loadingHeight?: string;
}

const Spinner = ({ loadingHeight }: { loadingHeight?: string }) => (
  <div
    className="w-full flex justify-center items-center py-8"
    style={{ height: loadingHeight || 'auto' }}
  >
    <Loader2 className="animate-spin text-muted-foreground" size={20} />
  </div>
);

export const LoadingCard = ({
  title,
  noCard = false,
  loadingHeight,
}: LoadingCardProps) => {
  if (noCard) {
    return <Spinner loadingHeight={loadingHeight} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      <Card>
        <CardContent>
          <Spinner loadingHeight={loadingHeight} />
        </CardContent>
      </Card>
    </div>
  );
};
