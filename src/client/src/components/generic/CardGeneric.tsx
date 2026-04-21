import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

// ─── Progress ────────────────────────────────────────────

export const Progress = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('m-1.25 bg-muted', className)} {...props} />
));

// ─── ProgressBar ─────────────────────────────────────────

const chartColors = {
  purple: '#6938f1',
  lightblue: '#1890ff',
  green: '#a0d911',
  orange: '#ffa940',
  orange2: '#FD5F00',
  darkyellow: '#ffd300',
  red: 'red',
};

const orderColors: Record<number, string | null> = {
  0: chartColors.purple,
  1: chartColors.lightblue,
  2: chartColors.green,
  3: chartColors.orange,
  4: null, // theme-dependent — handled via class
  5: chartColors.orange2,
  6: chartColors.darkyellow,
  7: chartColors.red,
  8: 'transparent',
};

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  percent: number;
  order?: number;
  barHeight?: number;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ percent, order = 0, barHeight, className, style, ...props }, ref) => {
    const color = orderColors[order] ?? chartColors.purple;
    const isThemeDependent = order === 4;

    return (
      <div
        ref={ref}
        className={cn(isThemeDependent && 'bg-muted', className)}
        style={{
          width: `${percent}%`,
          height: barHeight ? `${barHeight}px` : '10px',
          ...(!isThemeDependent ? { backgroundColor: color } : {}),
          ...style,
        }}
        {...props}
      />
    );
  }
);

// ─── Node / Status ───────────────────────────────────────

export const NodeTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-base font-bold w-auto mb-2 whitespace-nowrap overflow-hidden text-ellipsis md:w-60 md:mb-0 flex items-center',
      className
    )}
    {...props}
  />
));

export const StatusLine = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-full relative -right-3 -top-3 flex justify-end -mb-2',
      className
    )}
    {...props}
  />
));

interface MainInfoProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

export const MainInfo = forwardRef<HTMLDivElement, MainInfoProps>(
  ({ disabled, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(!disabled && 'cursor-pointer', className)}
      {...props}
    />
  )
);

interface StatusDotProps extends HTMLAttributes<HTMLDivElement> {
  color: string;
}

export const StatusDot = forwardRef<HTMLDivElement, StatusDotProps>(
  ({ color, className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mx-0.5 h-2 w-2 rounded-full', className)}
      style={{ backgroundColor: color, ...style }}
      {...props}
    />
  )
);

export const DetailLine = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'my-1 text-sm wrap-break-words flex justify-between flex-wrap md:flex-nowrap',
      className
    )}
    {...props}
  />
));

// ─── Card (simpler version without mobile overrides) ─────

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  bottom?: string;
  cardPadding?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ bottom, cardPadding, className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-card shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-border w-full',
        className
      )}
      style={{
        padding: cardPadding ?? '16px',
        marginBottom: bottom ?? '25px',
        ...style,
      }}
      {...props}
    />
  )
);
