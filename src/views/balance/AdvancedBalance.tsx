import { useReducer, useState } from 'react';
import { useBosRebalanceMutation } from 'src/graphql/mutations/__generated__/bosRebalance.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { Card, Separation, SingleLine } from 'src/components/generic/Styled';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import {
  MultiButton,
  SingleButton,
} from 'src/components/buttons/multiButton/MultiButton';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import Modal from 'src/components/modal/ReactModal';
import { Plus, Minus } from 'react-feather';
import { chartColors } from 'src/styles/Themes';
import { ViewSwitch } from 'src/components/viewSwitch/ViewSwitch';
import { useMutationResultWithReset } from 'src/hooks/UseMutationWithReset';
import {
  useRebalanceState,
  useRebalanceDispatch,
} from 'src/context/RebalanceContext';
import { Text } from 'src/components/typography/Styled';
import { AdvancedResult } from './AdvancedResult';
import { ModalNodes } from './Modals/ModalNodes';
import {
  RebalanceTag,
  RebalanceLine,
  RebalanceWrapLine,
  RebalanceSubTitle,
} from './Balance.styled';
import { PeerSelection } from './PeerSelection';

export type RebalanceIdType = {
  alias: string;
  id: string;
};

const defaultRebalanceId: RebalanceIdType = {
  alias: '',
  id: '',
};

type StateType = {
  avoid: RebalanceIdType[];
  in_through: RebalanceIdType;
  is_avoiding_high_inbound: boolean;
  max_fee: number;
  max_fee_rate: number;
  max_rebalance: number;
  out_through: RebalanceIdType;
  out_inbound: number;
  node: RebalanceIdType;
};

export type ActionType =
  | {
      type: 'avoidHigh';
      avoid: boolean;
    }
  | {
      type: 'maxFee' | 'maxFeeRate' | 'maxRebalance' | 'out_inbound';
      amount: number;
    }
  | {
      type: 'withNode';
      node: RebalanceIdType;
    }
  | {
      type: 'outChannel' | 'inChannel';
      channel: RebalanceIdType;
    }
  | {
      type: 'avoidNodes';
      avoid: RebalanceIdType[];
    }
  | {
      type: 'addNode';
      node: RebalanceIdType;
    }
  | {
      type: 'removeNode';
      public_key: string;
    }
  | {
      type: 'clearFilters';
    };

const initialState: StateType = {
  avoid: [],
  in_through: defaultRebalanceId,
  is_avoiding_high_inbound: false,
  max_fee: 10,
  max_fee_rate: 100,
  max_rebalance: 0,
  out_through: defaultRebalanceId,
  out_inbound: 0,
  node: defaultRebalanceId,
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
    case 'out_inbound':
      return { ...state, out_inbound: action.amount };
    case 'withNode':
      return { ...state, node: action.node };
    case 'inChannel':
      return { ...state, in_through: action.channel };
    case 'outChannel':
      return { ...state, out_through: action.channel };
    case 'avoidNodes':
      return { ...state, avoid: action.avoid };
    case 'addNode': {
      const same = state.avoid.filter(n => n.id === action.node.id);
      if (same.length <= 0) {
        return { ...state, avoid: [...state.avoid, action.node] };
      }
      return state;
    }
    case 'removeNode': {
      const filtered = state.avoid.filter(n => n.id !== action.public_key);
      return { ...state, avoid: filtered };
    }
    case 'clearFilters':
      return initialState;
    default:
      return state;
  }
};

const SettingLine: React.FC<{ title: string }> = ({ children, title }) => (
  <RebalanceLine>
    <RebalanceSubTitle>{title}</RebalanceSubTitle>
    <SingleLine>{children}</SingleLine>
  </RebalanceLine>
);

export const AdvancedBalance = () => {
  const [openType, openTypeSet] = useState<string>('none');
  const [isTarget, setIsTarget] = useState<boolean>(false);

  const rebalanceDispatch = useRebalanceDispatch();
  const { inChannel, outChannel } = useRebalanceState();

  const in_through = inChannel
    ? {
        alias: inChannel.partner_node_info?.node?.alias,
        id: inChannel.partner_public_key,
      }
    : defaultRebalanceId;

  const out_through = outChannel
    ? {
        alias: outChannel.partner_node_info?.node?.alias,
        id: outChannel.partner_public_key,
      }
    : defaultRebalanceId;

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    in_through,
    out_through,
  });

  const [rebalance, { data: _data, loading }] = useBosRebalanceMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      dispatch({ type: 'clearFilters' });
      toast.success('Balancing finished');
    },
    refetchQueries: ['GetChannels'],
  });
  const [data, resetMutationResult] = useMutationResultWithReset(_data);

  const hasInChannel = !!state.in_through.alias;
  const hasOutChannel = !!state.out_through.alias;
  const hasAvoid = state.avoid.length > 0;

  const isDisabled =
    loading ||
    !hasInChannel ||
    !hasOutChannel ||
    state.max_fee <= 0 ||
    state.max_fee_rate <= 0 ||
    (state.max_rebalance <= 0 && state.out_inbound <= 0);

  const renderDetails = () => (
    <>
      <Text>1. Select the peers that will be rebalanced.</Text>
      <PeerSelection
        inThroughId={state.in_through.id}
        outThroughId={state.out_through.id}
        inCallback={c => {
          if (!c.length) {
            rebalanceDispatch({ type: 'setIn', channel: null });
            dispatch({ type: 'inChannel', channel: defaultRebalanceId });
          } else {
            const channel = c.map(o => ({
              alias: o.partner_node_info.node.alias,
              id: o.partner_public_key,
            }))[0];
            dispatch({ type: 'inChannel', channel });
          }
        }}
        outCallback={c => {
          if (!c.length) {
            rebalanceDispatch({ type: 'setOut', channel: null });
            dispatch({ type: 'outChannel', channel: defaultRebalanceId });
          } else {
            const channel = c.map(o => ({
              alias: o.partner_node_info.node.alias,
              id: o.partner_public_key,
            }))[0];
            dispatch({ type: 'outChannel', channel });
          }
        }}
      />
      <Separation />
      <Text>2. Select the fee to look out for.</Text>
      <InputWithDeco
        inputType={'number'}
        title={'Max Fee'}
        value={state.max_fee || ''}
        placeholder={'sats'}
        amount={state.max_fee}
        override={'sat'}
        inputCallback={value =>
          dispatch({ type: 'maxFee', amount: Number(value) })
        }
      />
      <InputWithDeco
        inputType={'number'}
        title={'Max Fee Rate'}
        value={state.max_fee_rate || ''}
        placeholder={'ppm'}
        amount={state.max_fee_rate}
        override={'ppm'}
        inputCallback={value =>
          dispatch({ type: 'maxFeeRate', amount: Number(value) })
        }
      />
      <Separation />
      <Text>3. Select the amount you want to rebalance.</Text>
      <InputWithDeco title={'Amount Type'} noInput={true}>
        <MultiButton>
          <SingleButton selected={!isTarget} onClick={() => setIsTarget(false)}>
            Fixed
          </SingleButton>
          <SingleButton selected={isTarget} onClick={() => setIsTarget(true)}>
            Target
          </SingleButton>
        </MultiButton>
      </InputWithDeco>
      {isTarget ? (
        <InputWithDeco
          inputType={'number'}
          title={'Target Amount'}
          value={state.out_inbound || ''}
          placeholder={'sats to rebalance'}
          amount={state.out_inbound}
          inputCallback={value =>
            dispatch({ type: 'out_inbound', amount: Number(value) })
          }
        />
      ) : (
        <InputWithDeco
          inputType={'number'}
          title={'Max Rebalance'}
          value={state.max_rebalance || ''}
          placeholder={'sats'}
          amount={state.max_rebalance}
          inputCallback={value =>
            dispatch({ type: 'maxRebalance', amount: Number(value) })
          }
        />
      )}
      <Separation />
      <Text>{'4. Select nodes that you want to avoid. (Optional)'}</Text>
      <SettingLine title={'Avoid Nodes'}>
        {hasAvoid && (
          <>
            <ViewSwitch hideMobile={true}>
              <RebalanceWrapLine>
                {state.avoid.map(a => (
                  <RebalanceTag key={a.id}>{a.alias}</RebalanceTag>
                ))}
              </RebalanceWrapLine>
            </ViewSwitch>
            <ViewSwitch>
              <RebalanceTag>{state.avoid.length}</RebalanceTag>
            </ViewSwitch>
          </>
        )}
        <ColorButton
          color={hasAvoid ? chartColors.red : undefined}
          onClick={() => openTypeSet('avoidNodes')}
        >
          {hasAvoid ? <Minus size={18} /> : <Plus size={18} />}
        </ColorButton>
      </SettingLine>
      <Separation />
    </>
  );

  return (
    <>
      {data && data.bosRebalance ? (
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          <AdvancedResult rebalanceResult={data.bosRebalance} />
          <ColorButton
            fullWidth={true}
            onClick={() => {
              resetMutationResult();
            }}
          >
            Balance Again
          </ColorButton>
        </Card>
      ) : (
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          {renderDetails()}
          <SingleLine>
            <ColorButton
              color={chartColors.orange2}
              withMargin={'16px 8px 0 0'}
              fullWidth={true}
              onClick={() => {
                dispatch({ type: 'clearFilters' });
              }}
            >
              Reset
            </ColorButton>
            <ColorButton
              withMargin={'16px 0 0'}
              loading={loading}
              disabled={isDisabled}
              fullWidth={true}
              onClick={() => {
                rebalance({
                  variables: {
                    ...(isTarget
                      ? { out_inbound: state.out_inbound }
                      : { max_rebalance: state.max_rebalance }),
                    max_fee_rate: state.max_fee_rate,
                    max_fee: state.max_fee,
                    avoid: state.avoid.map(a => a.id),
                    in_through: state.in_through.id,
                    out_through: state.out_through.id,
                  },
                });
              }}
            >
              Rebalance
            </ColorButton>
          </SingleLine>
        </Card>
      )}
      <Modal
        isOpen={openType !== 'none'}
        closeCallback={() => {
          openTypeSet('none');
        }}
      >
        <ModalNodes
          multi={true}
          dispatch={dispatch}
          nodes={state.avoid}
          openSet={() => openTypeSet('none')}
        />
      </Modal>
    </>
  );
};
