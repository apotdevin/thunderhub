import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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

const SkeletonContent = () => (
  <div className="flex flex-col gap-3 py-2">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-5/6" />
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
          <SkeletonContent />
        </CardContent>
      </Card>
    </div>
  );
};
