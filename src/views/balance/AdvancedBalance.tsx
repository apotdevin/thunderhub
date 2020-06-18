import * as React from 'react';
import { useBosRebalanceMutation } from 'src/graphql/mutations/__generated__/bosRebalance.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { SecureButton } from 'src/components/buttons/secureButton/SecureButton';
import { Card, Separation } from 'src/components/generic/Styled';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import {
  MultiButton,
  SingleButton,
} from 'src/components/buttons/multiButton/MultiButton';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';

import Modal from 'src/components/modal/ReactModal';
import { AdvancedResult } from './AdvancedResult';

type StateType = {
  avoid: string[];
  in_through: string;
  is_avoiding_high_inbound: boolean;
  max_fee: number;
  max_fee_rate: number;
  max_rebalance: number;
  out_channels: string[];
  out_through: string;
  target: number;
};

type ActionType =
  | {
      type: 'avoidHigh';
      avoid: boolean;
    }
  | {
      type: 'maxFee' | 'maxFeeRate' | 'maxRebalance' | 'target';
      amount: number;
    };

const initialState: StateType = {
  avoid: [],
  in_through: '',
  is_avoiding_high_inbound: false,
  max_fee: null,
  max_fee_rate: null,
  max_rebalance: null,
  out_channels: [],
  out_through: '',
  target: null,
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'avoidHigh':
      return { ...state, is_avoiding_high_inbound: action.avoid };
    case 'maxFee':
      return { ...state, max_fee: action.amount };
    case 'maxFeeRate':
      return { ...state, max_fee_rate: action.amount };
    case 'maxRebalance':
      return { ...state, max_rebalance: action.amount };
    case 'target':
      return { ...state, target: action.amount };
    default:
      return state;
  }
};

export const AdvancedBalance = () => {
  const [openType, openTypeSet] = React.useState<string>('none');
  const [isDetailed, isDetailedSet] = React.useState<boolean>(false);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const [rebalance, { data, loading }] = useBosRebalanceMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => toast.success('Balancing finished'),
    refetchQueries: ['GetChannels'],
  });

  const renderButton = (
    onClick: () => void,
    text: string,
    selected: boolean
  ) => (
    <SingleButton selected={selected} onClick={onClick}>
      {text}
    </SingleButton>
  );

  const renderDetails = () => (
    <>
      <Separation />
      <InputWithDeco title={'With Node'} noInput={true}>
        <ColorButton onClick={() => openTypeSet('addNode')}>Add</ColorButton>
      </InputWithDeco>
      <InputWithDeco title={'Avoid Nodes'} noInput={true}>
        <ColorButton>Add</ColorButton>
      </InputWithDeco>
      <InputWithDeco title={'In Through Channel'} noInput={true}>
        <ColorButton>Add</ColorButton>
      </InputWithDeco>
      <InputWithDeco title={'Out Through Channel'} noInput={true}>
        <ColorButton>Add</ColorButton>
      </InputWithDeco>
      <InputWithDeco title={'Out Through Channels'} noInput={true}>
        <ColorButton>Add</ColorButton>
      </InputWithDeco>
      <InputWithDeco title={'Avoid High Inbound'} noInput={true}>
        <MultiButton>
          {renderButton(
            () => dispatch({ type: 'avoidHigh', avoid: true }),
            'Yes',
            state.is_avoiding_high_inbound
          )}
          {renderButton(
            () => dispatch({ type: 'avoidHigh', avoid: true }),
            'No',
            !state.is_avoiding_high_inbound
          )}
        </MultiButton>
      </InputWithDeco>
      <InputWithDeco
        title={'Max Fee'}
        placeholder={'sats'}
        amount={state.max_fee}
        override={'sat'}
        inputCallback={value =>
          dispatch({ type: 'maxFee', amount: Number(value) })
        }
      />
      <InputWithDeco
        title={'Max Fee Rate'}
        placeholder={'ppm'}
        amount={state.max_fee_rate}
        override={'ppm'}
        inputCallback={value =>
          dispatch({ type: 'maxFeeRate', amount: Number(value) })
        }
      />
      <InputWithDeco
        title={'Max Rebalance'}
        placeholder={'sats'}
        amount={state.max_rebalance}
        inputCallback={value =>
          dispatch({ type: 'maxRebalance', amount: Number(value) })
        }
      />
      <InputWithDeco
        title={'Target Amount'}
        placeholder={'sats to rebalance'}
        amount={state.target}
        inputCallback={value =>
          dispatch({ type: 'target', amount: Number(value) })
        }
      />
    </>
  );

  return (
    <>
      <Card mobileCardPadding={'0'} mobileNoBackground={true}>
        <InputWithDeco title={'Type'} noInput={true}>
          <MultiButton>
            {renderButton(() => isDetailedSet(false), 'Auto', !isDetailed)}
            {renderButton(() => isDetailedSet(true), 'Detailed', isDetailed)}
          </MultiButton>
        </InputWithDeco>
        {isDetailed && renderDetails()}
        <Separation />
        <SecureButton
          withMargin={'16px 0 0'}
          callback={rebalance}
          loading={loading}
          disabled={loading}
          variables={state}
          fullWidth={true}
        >
          Rebalance
        </SecureButton>
      </Card>
      {data && data.bosRebalance && (
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          <AdvancedResult rebalanceResult={data.bosRebalance} />
        </Card>
      )}
      <Modal
        isOpen={openType !== 'none'}
        closeCallback={() => {
          openTypeSet('none');
        }}
      >
        Hello
      </Modal>
    </>
  );
};
