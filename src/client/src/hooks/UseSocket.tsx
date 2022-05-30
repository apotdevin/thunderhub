import { useContext, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../context/SocketContext';

export const useSocket = (disabled?: boolean) => {
  const socket = useRef<Socket | undefined>(undefined);

  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  const { getStatus, createConnection, getError } = context;

  const status = getStatus();
  const error = getError();

  useEffect(() => {
    if (disabled) return;
    const { socket: _socket, cleanup } = createConnection();
    socket.current = _socket;
    return () => {
      cleanup();
    };
  }, [createConnection, disabled]);

  return {
    socket: socket.current,
    status,
    error,
  };
};

export const useSocketEvent = (
  socket: Socket | undefined,
  event: string,
  cbk?: (data: any) => void
) => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error('useSocketEvent must be used within a SocketProvider');
  }

  const { registerSharedListener, getLastMessage } = context;
  const lastMessage = getLastMessage(event);
  const sendMessage = (message: any) => socket?.emit(event, message);

  useEffect(() => {
    registerSharedListener(event);
  }, [event, registerSharedListener]);

  useEffect(() => {
    if (!lastMessage) return;
    cbk?.(lastMessage);
  }, [lastMessage, cbk]);

  return { lastMessage, sendMessage };
};
