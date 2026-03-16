import { FC, useState, useEffect, useRef } from 'react';
import {
  useEventLogState,
  useEventLogDispatch,
  useEventLog,
  EventLogEntry,
  EventField,
} from '../../context/EventLogContext';
import {
  useNotificationState,
  useNotificationDispatch,
} from '../../context/NotificationContext';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import { Switch } from '../../components/ui/switch';
import {
  Activity,
  Trash2,
  Zap,
  ArrowRightLeft,
  Cable,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  Settings,
} from 'lucide-react';
import { fakeEvents } from './fakeEvents';

const formatRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('invoice'))
    return <FileText size={12} className="text-purple-400" />;
  if (t.includes('payment'))
    return <Zap size={12} className="text-yellow-500" />;
  if (t.includes('forward'))
    return <ArrowRightLeft size={12} className="text-blue-400" />;
  if (t.includes('channel'))
    return <Cable size={12} className="text-green-400" />;
  return <Zap size={12} className="text-yellow-500" />;
};

const FieldRow: FC<{ field: EventField }> = ({ field }) => {
  if (!field.value) return null;
  return (
    <div className="flex justify-between gap-2 text-[11px] leading-snug">
      <span className="text-muted-foreground/50 shrink-0">{field.label}</span>
      <span className="text-right truncate">{field.value}</span>
    </div>
  );
};

const EventEntry: FC<{ entry: EventLogEntry; index: number }> = ({
  entry,
  index,
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = entry.details.length > 0;

  return (
    <div className={`px-2 ${index % 2 === 1 ? 'bg-muted/50' : ''}`}>
      <div className="flex items-start gap-2 py-1.5">
        <span
          className={`mt-0.5 shrink-0 ${
            entry.status === 'error'
              ? 'text-red-400'
              : 'text-muted-foreground/70'
          }`}
        >
          {getIcon(entry.title)}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium truncate text-foreground">
              {entry.title}
            </span>
            <span className="text-[10px] tabular-nums text-muted-foreground/40 shrink-0">
              {formatRelativeTime(entry.timestamp)}
            </span>
          </div>
          <div className="mt-0.5 text-muted-foreground">
            {entry.summary.map((f, i) => (
              <FieldRow key={i} field={f} />
            ))}
          </div>
          {hasDetails && (
            <>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-0.5 mt-0.5 text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                <ChevronDown
                  size={10}
                  className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                />
                {expanded ? 'Less' : 'More'}
              </button>
              {expanded && (
                <div className="mt-0.5 text-muted-foreground [&_a]:text-blue-400 [&_a]:hover:underline">
                  {entry.details.map((f, i) => (
                    <FieldRow key={i} field={f} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationToggles: FC = () => {
  const { invoices, payments, channels, forwards, forwardAttempts } =
    useNotificationState();
  const dispatch = useNotificationDispatch();

  const items = [
    { label: 'Invoices', property: 'invoices', value: invoices },
    { label: 'Payments', property: 'payments', value: payments },
    { label: 'Channels', property: 'channels', value: channels },
    { label: 'Forwards', property: 'forwards', value: forwards },
    {
      label: 'Forward Attempts',
      property: 'forwardAttempts',
      value: forwardAttempts,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-medium text-muted-foreground">
        Enable event types
      </div>
      {items.map(item => (
        <div key={item.property} className="flex items-center justify-between">
          <span className="text-[11px]">{item.label}</span>
          <Switch
            checked={item.value}
            onCheckedChange={checked =>
              dispatch({ type: 'change', [item.property]: checked })
            }
          />
        </div>
      ))}
    </div>
  );
};

export const EventLog: FC = () => {
  const { entries } = useEventLogState();
  const dispatch = useEventLogDispatch();
  const { addEvent } = useEventLog();
  const { sidebarEventsExpanded } = useConfigState();
  const configDispatch = useConfigDispatch();
  const [ping, setPing] = useState(false);
  const prevCount = useRef(entries.length);

  useEffect(() => {
    if (entries.length > prevCount.current) {
      setPing(true);
      const t = setTimeout(() => setPing(false), 2000);
      return () => clearTimeout(t);
    }
    prevCount.current = entries.length;
  }, [entries.length]);

  useEffect(() => {
    prevCount.current = entries.length;
  }, [entries.length]);

  const { invoices, payments, channels, forwards, forwardAttempts } =
    useNotificationState();
  const anyEnabled =
    invoices || payments || channels || forwards || forwardAttempts;

  const pushFakeEvent = () => {
    const event = fakeEvents[Math.floor(Math.random() * fakeEvents.length)];
    addEvent(event);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between p-2 border-y border-border/60">
        <button
          onClick={() =>
            configDispatch({
              type: 'change',
              sidebarEventsExpanded: !sidebarEventsExpanded,
            })
          }
          className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          {sidebarEventsExpanded ? (
            <ChevronDown size={10} />
          ) : (
            <ChevronUp size={10} />
          )}
          <Activity size={13} className="text-purple-400" />
          Events
          {entries.length > 0 && (
            <span className="text-muted-foreground/40 flex items-center gap-2">
              {entries.length}
              {ping ? (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-2 animate-ping rounded-full bg-purple-300 opacity-75" />
                  <span className="absolute inline-flex size-2 rounded-full bg-green-500" />
                </span>
              ) : (
                <span className="size-2 rounded-full bg-accent" />
              )}
            </span>
          )}
        </button>
        <div className="flex items-center gap-1.5">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                title="Notification settings"
              >
                <Settings size={11} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-52">
              <NotificationToggles />
            </PopoverContent>
          </Popover>
          {entries.length > 0 && (
            <button
              onClick={() => dispatch({ type: 'clear' })}
              className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              title="Clear all"
            >
              <Trash2 size={11} />
            </button>
          )}
          {import.meta.env.DEV && (
            <button
              onClick={pushFakeEvent}
              className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              title="Add fake event"
            >
              <Plus size={11} />
            </button>
          )}
        </div>
      </div>
      {sidebarEventsExpanded && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {!anyEnabled ? (
            <div className="flex flex-col items-center justify-center py-8 gap-1.5 text-muted-foreground/40">
              <Settings size={16} />
              <span className="text-[11px]">No events enabled</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-1.5 text-muted-foreground/40">
              <Zap size={16} />
              <span className="text-[11px]">No events yet</span>
            </div>
          ) : (
            entries.map((entry, i) => (
              <EventEntry key={entry.id} entry={entry} index={i} />
            ))
          )}
        </div>
      )}
    </div>
  );
};
