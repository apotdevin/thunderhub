import React, { createContext, useContext, useReducer } from 'react';

type State = {
    connected: boolean;
    loading: boolean;
    error: boolean;
};

type ActionType = {
    type: 'connected' | 'loading' | 'error' | 'disconnected';
};

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const stateReducer = (state: State, action: ActionType) => {
    switch (action.type) {
        case 'connected':
            return { connected: true, loading: false, error: false };
        case 'loading':
        case 'disconnected':
            return { connected: false, loading: true, error: false };
        default:
            return { connected: false, loading: false, error: true };
    }
};

const initialState = {
    connected: false,
    loading: true,
    error: false,
};

const ConnectionProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

const useConnectionState = () => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error(
            'useConnectionState must be used within a ConnectionProvider',
        );
    }
    return context;
};

const useConnectionDispatch = () => {
    const context = useContext(DispatchContext);
    if (context === undefined) {
        throw new Error(
            'useConnectionDispatch must be used within a ConnectionProvider',
        );
    }
    return context;
};

export { ConnectionProvider, useConnectionState, useConnectionDispatch };
