import { useContext, useEffect } from 'react';
import { SseContext } from '../context/SseContext';

export const useSse = (disabled?: boolean) => {
  const context = useContext(SseContext);

  if (context === undefined) {
    throw new Error('useSse must be used within a SseProvider');
  }

  const { getStatus, connect, getError } = context;

  const status = getStatus();
  const error = getError();

  useEffect(() => {
    if (disabled) return;
    const { cleanup } = connect();
    return () => {
      cleanup();
    };
  }, [connect, disabled]);

  return {
    connected: status === 'connected',
    status,
    error,
  };
};

export const useSseEvent = (event: string, cbk?: (data: any) => void) => {
  const context = useContext(SseContext);

  if (context === undefined) {
    throw new Error('useSseEvent must be used within a SseProvider');
  }

  const { getLastMessage } = context;
  const lastMessage = getLastMessage(event);

  useEffect(() => {
    if (!lastMessage) return;
    cbk?.(lastMessage);
  }, [lastMessage, cbk]);

  return { lastMessage };
};
