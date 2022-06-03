import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { SingleLine } from '../../components/generic/Styled';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import styled from 'styled-components';

const NoWrapText = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;

const InputTitle = styled(NoWrapText)``;

export const defaultSettings = {
  rebalance: false,
  confirmed: true,
};

export const PeerSwapSettings = () => {
  const [settings, setSettings] = useLocalStorage(
    'peerswapSettings',
    defaultSettings
  );

  const { rebalance, confirmed } = settings;

  return (
    <>
      <SingleLine>
        <InputTitle>Confirmed</InputTitle>
        <MultiButton>
          <SingleButton
            selected={confirmed}
            onClick={() => setSettings({ ...settings, confirmed: true })}
          >
            Yes
          </SingleButton>
          <SingleButton
            selected={!confirmed}
            onClick={() => setSettings({ ...settings, confirmed: false })}
          >
            No
          </SingleButton>
        </MultiButton>
      </SingleLine>
      <SingleLine>
        <InputTitle>Circular Payment</InputTitle>
        <MultiButton margin={'8px 0'}>
          <SingleButton
            selected={rebalance}
            onClick={() => setSettings({ ...settings, rebalance: true })}
          >
            Yes
          </SingleButton>
          <SingleButton
            selected={!rebalance}
            onClick={() => setSettings({ ...settings, rebalance: false })}
          >
            No
          </SingleButton>
        </MultiButton>
      </SingleLine>
    </>
  );
};
