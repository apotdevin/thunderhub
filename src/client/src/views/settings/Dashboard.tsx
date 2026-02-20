import { useNavigate } from 'react-router-dom';
import { SettingsLine } from '../../pages/SettingsPage';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
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
          <ColorButton
            arrow={true}
            onClick={() => navigate('/settings/dashboard')}
          >
            Change
          </ColorButton>
        </SettingsLine>
      </Card>
    </CardWithTitle>
  );
};
