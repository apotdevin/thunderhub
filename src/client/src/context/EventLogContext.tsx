import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';

const MAX_ENTRIES = 100;

export type EventField = { label: string; value: ReactNode };

export type EventLogEntry = {
  id: string;
  type: string;
  title: string;
  summary: EventField[];
  details: EventField[];
  timestamp: number;
  status: 'success' | 'error';
};

type State = {
  entries: EventLogEntry[];
};

type Action =
  | { type: 'add'; entry: Omit<EventLogEntry, 'id' | 'timestamp'> }
  | { type: 'dismiss'; id: string }
  | { type: 'clear' };

type Dispatch = (action: Action) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

let nextId = 0;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'add': {
      const entry: EventLogEntry = {
        ...action.entry,
        id: String(++nextId),
        timestamp: Date.now(),
      };
      return {
        entries: [entry, ...state.entries].slice(0, MAX_ENTRIES),
      };
    }
    case 'dismiss':
      return {
        entries: state.entries.filter(e => e.id !== action.id),
      };
    case 'clear':
      return { entries: [] };
    default:
      return state;
  }
};

export const EventLogProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, { entries: [] });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useEventLogState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useEventLogState must be used within an EventLogProvider');
  }
  return context;
};

export const useEventLogDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error(
      'useEventLogDispatch must be used within an EventLogProvider'
    );
  }
  return context;
};

export const useEventLog = () => {
  const dispatch = useEventLogDispatch();

  const addEvent = useCallback(
    (event: {
      title: string;
      summary: EventField[];
      details?: EventField[];
      status?: 'success' | 'error';
      type?: string;
    }) => {
      dispatch({
        type: 'add',
        entry: {
          title: event.title,
          summary: event.summary,
          details: event.details ?? [],
          status: event.status ?? 'success',
          type: event.type ?? 'event',
        },
      });
    },
    [dispatch]
  );

  const clearEvents = useCallback(() => {
    dispatch({ type: 'clear' });
  }, [dispatch]);

  return { addEvent, clearEvents };
};
