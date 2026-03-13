import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

export const DashboardSettings = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Configure your dashboard layout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Widgets</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings/dashboard')}
          >
            Customize <ChevronRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
