import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useNodeSlug } from '@/hooks/useNodeSlug';

export const DashboardSettings = () => {
  const { navigateToNode } = useNodeSlug();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Widgets</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToNode('/settings/dashboard')}
            >
              Customize <ChevronRight size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
