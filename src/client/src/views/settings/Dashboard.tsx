import { useNavigate } from 'react-router-dom';
import { SettingsLine } from '../../pages/SettingsPage';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import {
  Card,
  CardWithTitle,
  Sub4Title,
  SubTitle,
} from '../../components/generic/Styled';

export const DashboardSettings = () => {
  const navigate = useNavigate();

  return (
    <CardWithTitle>
      <SubTitle>Dashboard</SubTitle>
      <Card>
        <SettingsLine>
          <Sub4Title>Widgets</Sub4Title>
          <Button
            variant="outline"
            onClick={() => navigate('/settings/dashboard')}
          >
            Change <ChevronRight size={18} />
          </Button>
        </SettingsLine>
      </Card>
    </CardWithTitle>
  );
};
