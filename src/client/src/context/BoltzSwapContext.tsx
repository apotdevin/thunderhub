import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import toast from 'react-hot-toast';
import { useClaimBoltzTransactionMutation } from '../graphql/mutations/__generated__/claimBoltzTransaction.generated';
import { useBitcoinFees } from '../hooks/UseBitcoinFees';
import { isClaimableStatus } from '../views/swap/boltzStatus';
import { CreateBoltzReverseSwap } from '../views/swap/types';
import Modal from '../components/modal/ReactModal';
import { SwapQuote } from '../views/swap/SwapQuote';
import { SwapClaim } from '../views/swap/SwapClaim';

// --- Types ---

type LiveStatus = {
  status: string;
  transaction?: { id?: string | null; hex?: string | null };
} | null;

export type SwapEntry = CreateBoltzReverseSwap & {
  liveStatus: LiveStatus;
  claimState: 'idle' | 'claiming' | 'claimed' | 'failed';
  claimRetries: number;
};

type State = {
  swaps: SwapEntry[];
  openSwapId: string | null;
  claimSwapId: string | null;
  claimType: string | null;
};

type Action =
  | { type: 'init'; swaps: SwapEntry[] }
  | { type: 'add'; swap: CreateBoltzReverseSwap }
  | {
      type: 'updateStatus';
      id: string;
      status: string;
      transaction?: { id?: string | null; hex?: string | null };
    }
  | {
      type: 'setClaimState';
      id: string;
      claimState: SwapEntry['claimState'];
      retries?: number;
    }
  | { type: 'complete'; id: string; transactionId: string }
  | { type: 'open'; id: string }
  | { type: 'claim'; id: string; claimType: string }
  | { type: 'close' }
  | { type: 'cleanup' };

// --- Terminal statuses (WS won't update further) ---

const TERMINAL_STATUSES = new Set([
  'swap.expired',
  'invoice.expired',
  'invoice.failedToPay',
  'transaction.claimed',
  'transaction.refunded',
]);

const CLEANUP_STATUSES = new Set([
  'swap.expired',
  'invoice.expired',
  'transaction.refunded',
  'transaction.claimed',
  'invoice.settled',
]);

// --- localStorage ---

const STORAGE_KEY = 'boltz_swaps';
const OLD_SWAPS_KEY = 'swaps';

const toSwapEntry = (swap: CreateBoltzReverseSwap): SwapEntry => ({
  ...swap,
  liveStatus: null,
  claimState: 'idle',
  claimRetries: 0,
});

const loadSwaps = (): SwapEntry[] => {
  // Try new key first
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: SwapEntry[] = JSON.parse(raw);
      return parsed.map(s => ({
        ...s,
        liveStatus: null,
        claimState:
          s.claimState === 'claiming' ? 'idle' : (s.claimState ?? 'idle'),
        claimRetries: 0,
      }));
    }
  } catch {
    /* ignore */
  }

  // Migrate from old 'swaps' key
  try {
    const oldSwaps: CreateBoltzReverseSwap[] = JSON.parse(
      localStorage.getItem(OLD_SWAPS_KEY) || '[]'
    );
    if (oldSwaps.length > 0) {
      const entries = oldSwaps.filter(s => s?.id).map(toSwapEntry);
      localStorage.removeItem(OLD_SWAPS_KEY);
      if (entries.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      }
      return entries;
    }
  } catch {
    /* ignore */
  }

  return [];
};

const persistSwaps = (swaps: SwapEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(swaps));
};

// --- Reducer ---

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'init':
      return { ...state, swaps: action.swaps };

    case 'add': {
      const entry = toSwapEntry(action.swap);
      const swaps = [...state.swaps, entry];
      persistSwaps(swaps);
      return { ...state, swaps };
    }

    case 'updateStatus': {
      const swaps = state.swaps.map(s =>
        s.id === action.id
          ? {
              ...s,
              liveStatus: {
                status: action.status,
                transaction: action.transaction,
              },
            }
          : s
      );
      return { ...state, swaps };
    }

    case 'setClaimState': {
      const swaps = state.swaps.map(s =>
        s.id === action.id
          ? {
              ...s,
              claimState: action.claimState,
              claimRetries: action.retries ?? s.claimRetries,
            }
          : s
      );
      persistSwaps(swaps);
      return { ...state, swaps };
    }

    case 'complete': {
      const swaps = state.swaps.map(s =>
        s.id === action.id
          ? {
              ...s,
              claimTransaction: action.transactionId,
              claimState: 'claimed' as const,
              claimRetries: 0,
            }
          : s
      );
      persistSwaps(swaps);
      return {
        ...state,
        swaps,
        openSwapId: null,
        claimSwapId: null,
        claimType: null,
      };
    }

    case 'open':
      return {
        ...state,
        openSwapId: action.id,
        claimSwapId: null,
        claimType: null,
      };

    case 'claim':
      return {
        ...state,
        claimSwapId: action.id,
        claimType: action.claimType,
        openSwapId: null,
      };

    case 'close':
      return { ...state, openSwapId: null, claimSwapId: null, claimType: null };

    case 'cleanup': {
      const swaps = state.swaps.filter(s => {
        if (s.claimState === 'claiming') return true;
        const status = s.liveStatus?.status;
        if (!status) return true;
        return !CLEANUP_STATUSES.has(status);
      });
      persistSwaps(swaps);
      return { ...state, swaps };
    }

    default:
      return state;
  }
};

const initialState: State = {
  swaps: [],
  openSwapId: null,
  claimSwapId: null,
  claimType: null,
};

// --- WebSocket Manager ---

const BOLTZ_WS_URL = 'wss://api.boltz.exchange/v2/ws';
const PING_INTERVAL = 30000;
const RECONNECT_DELAY = 5000;

type WSManager = {
  connect: () => void;
  disconnect: () => void;
  updateIds: (ids: string[]) => void;
};

const createWSManager = (
  onUpdate: (
    id: string,
    status: string,
    transaction?: { id?: string | null; hex?: string | null }
  ) => void
): WSManager => {
  let ws: WebSocket | null = null;
  let pingTimer: ReturnType<typeof setInterval> | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let activeIds: string[] = [];
  let manualClose = false;

  const clearTimers = () => {
    if (pingTimer) {
      clearInterval(pingTimer);
      pingTimer = null;
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const sendSubscribe = (socket: WebSocket, ids: string[]) => {
    if (ids.length === 0 || socket.readyState !== WebSocket.OPEN) return;
    socket.send(
      JSON.stringify({ op: 'subscribe', channel: 'swap.update', args: ids })
    );
  };

  const connect = () => {
    if (ws && ws.readyState === WebSocket.OPEN) return;
    manualClose = false;
    clearTimers();

    const socket = new WebSocket(BOLTZ_WS_URL);
    ws = socket;

    socket.onopen = () => {
      sendSubscribe(socket, activeIds);
      pingTimer = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ op: 'ping' }));
        }
      }, PING_INTERVAL);
    };

    socket.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'pong' || data.event === 'ping') return;
        if (data.event === 'update' && data.channel === 'swap.update') {
          const updates: {
            id: string;
            status: string;
            transaction?: { id?: string | null; hex?: string | null };
          }[] = data.args;
          for (const u of updates) {
            onUpdate(u.id, u.status, u.transaction);
          }
        }
      } catch {
        /* ignore */
      }
    };

    socket.onerror = () => {
      /* silent */
    };

    socket.onclose = () => {
      clearTimers();
      ws = null;
      if (!manualClose && activeIds.length > 0) {
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
      }
    };
  };

  const disconnect = () => {
    manualClose = true;
    clearTimers();
    if (ws) {
      ws.close();
      ws = null;
    }
  };

  const updateIds = (ids: string[]) => {
    const newIds = ids.filter(id => !activeIds.includes(id));
    activeIds = ids;

    if (ids.length === 0) {
      disconnect();
      return;
    }

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      connect();
    } else if (newIds.length > 0) {
      sendSubscribe(ws, newIds);
    }
  };

  return { connect, disconnect, updateIds };
};

// --- Context ---

type BoltzSwapContextType = {
  state: State;
  dispatch: (action: Action) => void;
};

const BoltzSwapContext = createContext<BoltzSwapContextType | undefined>(
  undefined
);

// --- Provider ---

export const BoltzSwapProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fast } = useBitcoinFees();
  const fastRef = useRef(fast);
  fastRef.current = fast;

  // Load from localStorage on mount
  useEffect(() => {
    const swaps = loadSwaps();
    if (swaps.length > 0) {
      dispatch({ type: 'init', swaps });
    }
  }, []);

  // WS manager
  const wsManagerRef = useRef<WSManager | null>(null);

  useEffect(() => {
    const manager = createWSManager((id, status, transaction) => {
      dispatch({ type: 'updateStatus', id, status, transaction });
    });
    wsManagerRef.current = manager;
    return () => {
      manager.disconnect();
      // Clear any pending auto-claim timers
      for (const id of claimTimersRef.current) {
        clearTimeout(id);
      }
      claimTimersRef.current.clear();
    };
  }, []);

  // Keep WS subscribed to active (non-terminal) swap IDs
  const activeIds = useMemo(
    () =>
      state.swaps
        .filter(s => {
          const status = s.liveStatus?.status;
          if (!status) return true; // not yet known
          return !TERMINAL_STATUSES.has(status);
        })
        .map(s => s.id)
        .filter(Boolean),
    [state.swaps]
  );

  useEffect(() => {
    wsManagerRef.current?.updateIds(activeIds);
  }, [activeIds]);

  // Tab visibility: reconnect immediately when tab becomes visible
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible' && activeIds.length > 0) {
        wsManagerRef.current?.disconnect();
        wsManagerRef.current?.connect();
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [activeIds]);

  // Auto-claim mutation
  const [claimTransaction] = useClaimBoltzTransactionMutation();
  const claimingIdsRef = useRef(new Set<string>());
  const claimTimersRef = useRef(new Set<ReturnType<typeof setTimeout>>());

  const attemptAutoClaim = useCallback(
    (swap: SwapEntry) => {
      if (claimingIdsRef.current.has(swap.id)) return;
      if (
        !swap.preimage ||
        !swap.lockupAddress ||
        !swap.privateKey ||
        !swap.redeemScript
      )
        return;

      claimingIdsRef.current.add(swap.id);
      dispatch({
        type: 'setClaimState',
        id: swap.id,
        claimState: 'claiming',
        retries: 0,
      });

      const scheduleTimeout = (fn: () => void, ms: number) => {
        const id = setTimeout(() => {
          claimTimersRef.current.delete(id);
          fn();
        }, ms);
        claimTimersRef.current.add(id);
      };

      const doAttempt = (retries: number) => {
        claimTransaction({
          variables: {
            id: swap.id,
            redeem: swap.redeemScript!,
            lockupAddress: swap.lockupAddress!,
            preimage: swap.preimage!,
            privateKey: swap.privateKey!,
            destination: swap.receivingAddress,
            fee: fastRef.current || 2,
          },
        })
          .then(result => {
            const txId = result.data?.claimBoltzTransaction;
            if (txId) {
              dispatch({ type: 'complete', id: swap.id, transactionId: txId });
              toast.success('Swap claimed successfully!');
            } else {
              throw new Error('No transaction returned');
            }
            claimingIdsRef.current.delete(swap.id);
          })
          .catch(() => {
            if (retries < 4) {
              scheduleTimeout(() => {
                dispatch({
                  type: 'setClaimState',
                  id: swap.id,
                  claimState: 'claiming',
                  retries: retries + 1,
                });
                doAttempt(retries + 1);
              }, 5000);
            } else {
              dispatch({
                type: 'setClaimState',
                id: swap.id,
                claimState: 'failed',
                retries: 5,
              });
              claimingIdsRef.current.delete(swap.id);
              toast.error(
                'Auto-claim failed. Claim manually from the Swap page.'
              );
            }
          });
      };

      // Initial delay before first attempt
      scheduleTimeout(() => doAttempt(0), 5000);
    },
    [claimTransaction]
  );

  // Watch for claimable swaps
  useEffect(() => {
    for (const swap of state.swaps) {
      if (
        swap.claimState === 'idle' &&
        swap.liveStatus &&
        isClaimableStatus(swap.liveStatus.status)
      ) {
        attemptAutoClaim(swap);
      }
    }
  }, [state.swaps, attemptAutoClaim]);

  const ctx = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <BoltzSwapContext.Provider value={ctx}>
      {children}
      <BoltzSwapDialog state={state} dispatch={dispatch} />
    </BoltzSwapContext.Provider>
  );
};

// --- Global Dialog ---

const BoltzSwapDialog: FC<{
  state: State;
  dispatch: (action: Action) => void;
}> = ({ state, dispatch }) => {
  const { openSwapId, claimSwapId } = state;
  const isOpen = !!openSwapId || !!claimSwapId;

  return (
    <Modal isOpen={isOpen} closeCallback={() => dispatch({ type: 'close' })}>
      {openSwapId ? <SwapQuote /> : <SwapClaim />}
    </Modal>
  );
};

// --- Hooks ---

const useBoltzSwapContext = () => {
  const ctx = useContext(BoltzSwapContext);
  if (!ctx)
    throw new Error(
      'useBoltzSwapContext must be used within BoltzSwapProvider'
    );
  return ctx;
};

export const useBoltzSwaps = () => {
  const { state } = useBoltzSwapContext();
  return state;
};

export const useBoltzSwapById = (id: string | null) => {
  const { state } = useBoltzSwapContext();
  return useMemo(
    () => (id ? (state.swaps.find(s => s.id === id) ?? null) : null),
    [state.swaps, id]
  );
};

export const useBoltzSwapActions = () => {
  const { dispatch } = useBoltzSwapContext();

  return useMemo(
    () => ({
      addSwap: (swap: CreateBoltzReverseSwap) =>
        dispatch({ type: 'add', swap }),
      openSwap: (id: string) => dispatch({ type: 'open', id }),
      openClaim: (id: string, claimType: string) =>
        dispatch({ type: 'claim', id, claimType }),
      close: () => dispatch({ type: 'close' }),
      cleanup: () => dispatch({ type: 'cleanup' }),
      updateStatus: (
        id: string,
        status: string,
        transaction?: { id?: string | null; hex?: string | null }
      ) => dispatch({ type: 'updateStatus', id, status, transaction }),
      setClaimState: (id: string, claimState: SwapEntry['claimState']) =>
        dispatch({ type: 'setClaimState', id, claimState }),
      completeSwap: (id: string, transactionId: string) =>
        dispatch({ type: 'complete', id, transactionId }),
    }),
    [dispatch]
  );
};
