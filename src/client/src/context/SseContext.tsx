import React, { FC, ReactNode, useCallback, useRef, useState } from 'react';
import { config } from '../config/thunderhubConfig';

type Status = 'connecting' | 'connected' | 'disconnected';

type Connection = {
  cleanup: () => void;
};

type Context = {
  connect: () => Connection;
  getLastMessage: (forEvent: string) => any;
  getError: () => any;
  getStatus: () => Status;
};

const SseContext = React.createContext<Context | undefined>(undefined);

const SseProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const eventSource = useRef<EventSource | undefined>(undefined);

  const [status, setStatus] = useState<Status>('disconnected');
  const [error, setError] = useState<any>(undefined);
  const [lastMessages, setLastMessages] = useState<Record<string, any>>({});

  const connect = useCallback(() => {
    const cleanup = () => {
      eventSource.current?.close();
      setStatus('disconnected');
    };

    if (
      eventSource.current &&
      eventSource.current.readyState !== EventSource.CLOSED
    ) {
      return { cleanup };
    }

    setStatus('connecting');

    const url = `${config.basePath || ''}/api/sse/events`;
    const es = new EventSource(url, { withCredentials: true });

    eventSource.current = es;

    es.onopen = () => setStatus('connected');

    es.onmessage = (event: MessageEvent) => {
      if (!event.data) return;

      try {
        const parsed = JSON.parse(event.data);
        const { event: eventName, data } = parsed;

        if (eventName && data) {
          setLastMessages(state => ({
            ...state,
            [eventName]: data,
          }));
        }
      } catch {
        // heartbeat or invalid data, ignore
      }
    };

    es.onerror = () => {
      setError('SSE connection error');
      setStatus('disconnected');
    };

    return { cleanup };
  }, []);

  const getLastMessage = (forEvent = '') => lastMessages[forEvent];
  const getStatus = () => status;
  const getError = () => error;

  return (
    <SseContext.Provider
      value={{
        connect,
        getLastMessage,
        getError,
        getStatus,
      }}
    >
      {children}
    </SseContext.Provider>
  );
};

export { SseProvider, SseContext };
