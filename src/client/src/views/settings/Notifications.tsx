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
import styled from 'styled-components';
import { VFC } from 'react';
import {
  useNotificationDispatch,
  useNotificationState,
} from '../../context/NotificationContext';

const NoWrapText = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;

const InputTitle = styled(NoWrapText)``;

const Toggle: VFC<{
  title: string;
  property: string;
  value: boolean;
  cbk: (fields: any) => void;
}> = ({ title, property, value, cbk }) => {
  return (
    <SingleLine>
      <InputTitle>{title}</InputTitle>
      <MultiButton>
        <SingleButton
          selected={value}
          onClick={() => cbk({ [property]: true })}
        >
          Yes
        </SingleButton>
        <SingleButton
          selected={!value}
          onClick={() => cbk({ [property]: false })}
        >
          No
        </SingleButton>
      </MultiButton>
    </SingleLine>
  );
};

export const NotificationSettings = () => {
  const { channels, forwardAttempts, forwards, invoices, payments, autoClose } =
    useNotificationState();

  const dispatch = useNotificationDispatch();

  const handleToggle = (fields: any) => dispatch({ type: 'change', ...fields });

  return (
    <CardWithTitle>
      <SubTitle>Notifications</SubTitle>
      <Card>
        <Toggle
          title="Invoices"
          property="invoices"
          value={invoices}
          cbk={handleToggle}
        />
        <Toggle
          title="Payments"
          property="payments"
          value={payments}
          cbk={handleToggle}
        />
        <Toggle
          title="Channels"
          property="channels"
          value={channels}
          cbk={handleToggle}
        />
        <Toggle
          title="Forwards"
          property="forwards"
          value={forwards}
          cbk={handleToggle}
        />
        <Toggle
          title="Forward Attempts"
          property="forwardAttempts"
          value={forwardAttempts}
          cbk={handleToggle}
        />
        <Toggle
          title="Auto Close"
          property="autoClose"
          value={autoClose}
          cbk={handleToggle}
        />
      </Card>
    </CardWithTitle>
  );
};
