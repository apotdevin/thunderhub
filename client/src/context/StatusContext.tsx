import React, { createContext, useContext, useReducer } from 'react';

type State = {
    loading: boolean;
    alias: string;
    syncedToChain: boolean;
    version: string;
    mayorVersion: number;
    minorVersion: number;
    revision: number;
    chainBalance: number;
    chainPending: number;
    channelBalance: number;
    channelPending: number;
};

type ActionType = {
    type: 'connected' | 'disconnected';
    state?: State;
};

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const stateReducer = (state: State, action: ActionType): State => {
    switch (action.type) {
        case 'connected':
            return action.state || initialState;
        case 'disconnected':
            return initialState;
        default:
            return initialState;
    }
};

const initialState = {
    loading: true,
    alias: '',
    syncedToChain: false,
    version: '',
    mayorVersion: 0,
    minorVersion: 0,
    revision: 0,
    chainBalance: 0,
    chainPending: 0,
    channelBalance: 0,
    channelPending: 0,
};

const StatusProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
};

const useStatusState = () => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error('useStatusState must be used within a StatusProvider');
    }
    return context;
};

const useStatusDispatch = () => {
    const context = useContext(DispatchContext);
    if (context === undefined) {
        throw new Error(
            'useStatusDispatch must be used within a StatusProvider',
        );
    }
    return context;
};

export { StatusProvider, useStatusState, useStatusDispatch };
