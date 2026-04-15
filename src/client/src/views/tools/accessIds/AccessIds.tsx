import { useGetAccessIdsQuery } from '@/graphql/queries/__generated__/getAccessIds.generated';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingCard } from '@/components/loading/LoadingCard';
import { Badge } from '@/components/ui/badge';
import { KeyRound } from 'lucide-react';

export const AccessIds = () => {
  const { data, loading, error } = useGetAccessIdsQuery();

  if (error) return null;

  if (loading || !data?.lightning) {
    return <LoadingCard />;
  }

  const { ids } = data.lightning.get_access_ids;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Access IDs</h2>
      <Card>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <KeyRound size={14} />
              <span>Macaroon root key IDs with access to this node</span>
            </div>
            {ids.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No access IDs found.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ids.map(id => (
                  <Badge key={id} variant="outline">
                    {id}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
