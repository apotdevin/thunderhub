import React, { createContext, useContext, useReducer } from 'react';

type State = {
    loading: boolean;
    error: boolean;
    fast: number;
    halfHour: number;
    hour: number;
};

type ActionType = {
    type: 'fetched' | 'error';
    state?: State;
};

type Dispatch = (action: ActionType) => void;

export const StateContext = createContext<State | undefined>(undefined);
export const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState = {
    loading: true,
    error: false,
    fast: 0,
    halfHour: 0,
    hour: 0,
};

const stateReducer = (state: State, action: ActionType): State => {
    switch (action.type) {
        case 'fetched':
            return action.state || initialState;
        case 'error':
            return {
                ...initialState,
                loading: false,
                error: true,
            };
        default:
            return initialState;
    }
};

const BitcoinInfoProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
};

const useBitcoinState = () => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error(
            'useBitcoinState must be used within a BitcoinInfoProvider',
        );
    }
    return context;
};

const useBitcoinDispatch = () => {
    const context = useContext(DispatchContext);
    if (context === undefined) {
        throw new Error(
            'useBitcoinDispatch must be used within a BitcoinInfoProvider',
        );
    }
    return context;
};

export { BitcoinInfoProvider, useBitcoinState, useBitcoinDispatch };
