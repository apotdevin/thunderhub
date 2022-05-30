import React, { FC, useCallback, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { basePath } = publicRuntimeConfig;

type Connection = {
  socket: Socket | undefined;
  cleanup: () => void;
};

type CreateConnection = () => Connection;

type Status = 'connecting' | 'connected' | 'disconnected';

type Context = {
  createConnection: CreateConnection;
  getConnection: () => Socket | undefined;
  getLastMessage: (forEvent: string) => any;
  setLastMessage: (forEvent: string, message: any) => void;
  registerSharedListener: (forEvent: string) => void;
  getError: () => any;
  setError: (error: any) => void;
  getStatus: () => Status;
};

const SocketContext = React.createContext<Context | undefined>(undefined);

const SocketProvider: FC<{ authToken?: string }> = ({
  children,
  authToken,
}) => {
  const sockets = useRef<Socket | undefined>(undefined);

  const [status, setStatus] = useState<Status>('disconnected');
  const [error, setError] = useState<any>(undefined);

  const [lastMessages, setLastMessages] = useState<Record<string, any>>({});

  const createConnection = useCallback(() => {
    const cleanup = () => {
      sockets.current?.disconnect();
    };

    // Early return if the user has no authToken cookie
    if (!authToken) {
      return { socket: undefined, cleanup };
    }

    if (sockets.current) {
      sockets.current.connect();
      return { socket: sockets.current, cleanup };
    }

    const handleConnect = () => setStatus('connected');
    const handleDisconnect = () => setStatus('disconnected');

    const socket = io({
      ...(basePath ? { path: `${basePath}/socket.io` } : {}),
      reconnectionAttempts: 5,
    });

    sockets.current = socket;

    socket.on('error', (error: any) => setError(error));
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return { socket, cleanup };
  }, [authToken]);

  const getLastMessage = (forEvent = '') => lastMessages[forEvent];
  const setLastMessage = (forEvent: string, message: any) =>
    setLastMessages(state => ({
      ...state,
      [forEvent]: message,
    }));

  const getConnection = () => sockets.current;
  const getStatus = () => status;
  const getError = () => error;

  const registerSharedListener = (forEvent = '') => {
    if (!sockets.current) return;
    if (sockets.current.hasListeners(forEvent)) return;

    sockets.current.on(forEvent, (message: any) => {
      setLastMessages(state => ({
        ...state,
        [forEvent]: message,
      }));
    });
  };

  return (
    <SocketContext.Provider
      value={{
        createConnection,
        getConnection,
        getLastMessage,
        setLastMessage,
        getError,
        setError,
        getStatus,
        registerSharedListener,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
