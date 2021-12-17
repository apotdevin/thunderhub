import { useRouter } from 'next/router';
import { SettingsLine } from '../../../pages/settings';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  Card,
  CardWithTitle,
  Sub4Title,
  SubTitle,
} from '../../components/generic/Styled';

export const DashboardSettings = () => {
  const { push } = useRouter();

  return (
    <CardWithTitle>
      <SubTitle>Dashboard</SubTitle>
      <Card>
        <SettingsLine>
          <Sub4Title>Widgets</Sub4Title>
          <ColorButton arrow={true} onClick={() => push('/settings/dashboard')}>
            Change
          </ColorButton>
        </SettingsLine>
      </Card>
    </CardWithTitle>
  );
};
