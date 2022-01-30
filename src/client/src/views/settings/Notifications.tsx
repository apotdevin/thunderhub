import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import {
  Card,
  CardWithTitle,
  SingleLine,
  SubTitle,
} from '../../components/generic/Styled';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import styled from 'styled-components';

const NoWrapText = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;

const InputTitle = styled(NoWrapText)``;

export const defaultSettings = {
  allForwards: false,
  autoClose: false,
};

export const NotificationSettings = () => {
  const [settings, setSettings] = useLocalStorage(
    'notificationSettings',
    defaultSettings
  );

  const { allForwards, autoClose } = settings;

  return (
    <CardWithTitle>
      <SubTitle>Notifications</SubTitle>
      <Card>
        <SingleLine>
          <InputTitle>All Forwards</InputTitle>
          <MultiButton>
            <SingleButton
              selected={allForwards}
              onClick={() => setSettings({ ...settings, allForwards: true })}
            >
              Yes
            </SingleButton>
            <SingleButton
              selected={!allForwards}
              onClick={() => setSettings({ ...settings, allForwards: false })}
            >
              No
            </SingleButton>
          </MultiButton>
        </SingleLine>
        <SingleLine>
          <InputTitle>Auto Close</InputTitle>
          <MultiButton>
            <SingleButton
              selected={autoClose}
              onClick={() => setSettings({ ...settings, autoClose: true })}
            >
              Yes
            </SingleButton>
            <SingleButton
              selected={!autoClose}
              onClick={() => setSettings({ ...settings, autoClose: false })}
            >
              No
            </SingleButton>
          </MultiButton>
        </SingleLine>
      </Card>
    </CardWithTitle>
  );
};
