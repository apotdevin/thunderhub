import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { getPublicKey, nip19 } from 'nostr-tools';
import { Message } from '../../src/graphql/types';
// import { useNostrKeysQuery } from '../graphql/queries/__generated__/getNostrKeys.generated';

export interface Profile {
  isSent?: boolean;
  feePaid?: number;
}

type State = {
  initialized: boolean;
  chats: Message[];
  following: Profile[];
  nsec: string;
  sec: string;
  npub: string;
  pub: string;
  attestation: string;
};

type ActionType =
  | {
      type: 'initialized'; // All info is cached
    }
  | {
      type: 'change';
      nsec: string;
    }
  | {
      type: 'loadedKeys'; // User pastes in nsec or nsec is cached
      nsec: string;
    }
  | {
      type: 'profileFetched'; // attestation is fetched from relay
      attestation: string;
    }
  | {
      type: 'createdKeys'; // Generates new nsec
      sec: string;
      pub: string;
    }
  | {
      type: 'disconnected';
    };

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState: State = {
  initialized: false,
  chats: [],
  following: [],
  nsec: '',
  npub: '',
  pub: '',
  sec: '',
  attestation: '',
};
const handleSetNsec = (nsec: string) => {
  try {
    let sec = nsec;
    if (nsec.startsWith('nsec')) {
      sec = nip19.decode(nsec).data as string;
    }
    const pub = getPublicKey(sec);
    const npub = nip19.npubEncode(pub);
    return { nsec, sec, pub, npub };
  } catch (e) {
    console.error(e);
    throw e;
  }
};
// const handleGenerateNsec = () => {
//   try {
//     const { npub, nsec, pub } = handleSetNsec(nip19.nsecEncode(sec));
//     return { nsec, sec, pub, npub };
//   } catch (e) {
//     console.error(e);
//     throw e;
//   }
// };

const stateReducer = (state: State, action: ActionType): State => {
  let newState;
  switch (action.type) {
    case 'initialized':
      const cache = localStorage.getItem('nostr');
      let obj = {
        ...state,
        initialized: true,
        ...action,
      };
      try {
        const c = JSON.parse(cache ?? '{}');
        if (c?.nsec !== '') {
          obj.nsec = c.nsec;
          obj = {
            ...obj,
            ...handleSetNsec(c.nsec),
          };
        }
      } catch (e) {}
      return obj;

    case 'loadedKeys':
      console.log('loadedKeys');
      newState = {
        ...state,
        initialized: true,
        ...handleSetNsec(action.nsec),
        ...action,
      };
      localStorage.setItem('nostr', JSON.stringify(newState));
      return newState;

    case 'createdKeys':
      newState = {
        ...state,
        ...action,
        initialized: true,
        npub: nip19.npubEncode(action.pub),
        nsec: nip19.nsecEncode(action.sec),
      };
      console.log('NEW STATE, createdKeys', newState);
      localStorage.setItem('nostr', JSON.stringify(newState));
      return newState;

    case 'profileFetched':
      newState = {
        ...state,
        ...action,
      };
    case 'change':
      return {
        ...state,
        ...action,
      };
    case 'disconnected':
      return initialState;
    default:
      return state;
  }
};

const NostrProvider: React.FC = ({ children }) => {
  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem('nostr') || '{}');
    console.log('saved config', savedConfig);
    if (savedConfig?.nostr) {
      dispatch({ type: 'loadedKeys', ...savedConfig });
    }
  }, []);
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useNostrState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useNostrState must be used within a NostrProvider');
  }
  return context;
};

const useNostrDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useNostrDispatch must be used within a NostrProvider');
  }
  return context;
};

export { NostrProvider, useNostrState, useNostrDispatch };
