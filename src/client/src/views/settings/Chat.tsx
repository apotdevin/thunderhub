import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../pages/SettingsPage';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';

export const ChatSettings = () => {
  const {
    hideFee,
    hideNonVerified,
    maxFee,
    chatPollingSpeed: cps,
  } = useConfigState();
  const dispatch = useConfigDispatch();

  const renderButton = (
    title: string,
    type: string,
    current: boolean,
    value: boolean | number
  ) => (
    <Button
      variant={current ? 'default' : 'ghost'}
      className={cn('grow', !current && 'text-foreground')}
      onClick={() => {
        switch (type) {
          case 'fee':
            if (typeof value === 'boolean')
              dispatch({ type: 'change', hideFee: value });
            break;
          case 'nonverified':
            if (typeof value === 'boolean')
              dispatch({ type: 'change', hideNonVerified: value });
            break;
          case 'pollingSpeed':
            if (typeof value === 'number')
              dispatch({ type: 'change', chatPollingSpeed: value });
            break;
          default:
            if (typeof value === 'number')
              dispatch({ type: 'change', maxFee: value });
            break;
        }
      }}
    >
      {title}
    </Button>
  );

  return (
    <CardWithTitle>
      <SubTitle>Chat</SubTitle>
      <Card>
        <SettingsLine>
          <Sub4Title>Fee:</Sub4Title>
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
            {renderButton('Hide', 'fee', hideFee, true)}
            {renderButton('Show', 'fee', !hideFee, false)}
          </div>
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>Non-Verified Messages:</Sub4Title>
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
            {renderButton('Hide', 'nonverified', hideNonVerified, true)}
            {renderButton('Show', 'nonverified', !hideNonVerified, false)}
          </div>
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>{'Max Fee (sats):'}</Sub4Title>
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
            {renderButton('10', 'maxFee', maxFee === 10, 10)}
            {renderButton('20', 'maxFee', maxFee === 20, 20)}
            {renderButton('30', 'maxFee', maxFee === 30, 30)}
            {renderButton('50', 'maxFee', maxFee === 50, 50)}
            {renderButton('100', 'maxFee', maxFee === 100, 100)}
          </div>
        </SettingsLine>
        <SettingsLine>
          <Sub4Title>{'Polling Speed:'}</Sub4Title>
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
            {renderButton('1s', 'pollingSpeed', cps === 1000, 1000)}
            {renderButton('5s', 'pollingSpeed', cps === 5000, 5000)}
            {renderButton('10s', 'pollingSpeed', cps === 10000, 10000)}
            {renderButton('1m', 'pollingSpeed', cps === 60000, 60000)}
            {renderButton('10m', 'pollingSpeed', cps === 600000, 600000)}
            {renderButton('30m', 'pollingSpeed', cps === 1800000, 1800000)}
            {renderButton('None', 'pollingSpeed', cps === 0, 0)}
          </div>
        </SettingsLine>
      </Card>
    </CardWithTitle>
  );
};
