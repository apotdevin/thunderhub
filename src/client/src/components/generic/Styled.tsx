import {
  forwardRef,
  HTMLAttributes,
  AnchorHTMLAttributes,
  ComponentProps,
} from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

// ─── Layout ──────────────────────────────────────────────

export const CardWithTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col w-full', className)} {...props} />
));

export const CardTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex justify-between', className)} {...props} />
));

export const SingleLine = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-between items-center', className)}
    {...props}
  />
));

export const RightAlign = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('w-full flex justify-end items-center', className)}
    {...props}
  />
));

export const ColumnLine = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col w-full md:w-auto', className)}
    {...props}
  />
));

interface ResponsiveLineProps extends HTMLAttributes<HTMLDivElement> {
  withWrap?: boolean;
}

export const ResponsiveLine = forwardRef<HTMLDivElement, ResponsiveLineProps>(
  ({ withWrap, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col justify-between items-center w-full md:flex-row',
        withWrap && 'flex-wrap',
        className
      )}
      {...props}
    />
  )
);

export const ResponsiveCol = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('grow w-full md:w-auto', className)}
    {...props}
  />
));

export const ResponsiveSingle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex justify-between items-center grow min-w-[200px] w-full md:w-auto',
      className
    )}
    {...props}
  />
));

// ─── Card ────────────────────────────────────────────────

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  bottom?: string;
  cardPadding?: string;
  mobileCardPadding?: string;
  mobileNoBackground?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      bottom,
      cardPadding,
      mobileCardPadding,
      mobileNoBackground,
      className,
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'bg-white dark:bg-[#1a1f35] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-[#f0f2f8] dark:border-[#20263d] w-full',
        mobileNoBackground &&
          'bg-transparent border-none shadow-none md:bg-white md:dark:bg-[#1a1f35] md:shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] md:border md:border-[#f0f2f8] md:dark:border-[#20263d]',
        className
      )}
      style={{
        padding: cardPadding ?? '16px',
        marginBottom: bottom ?? '25px',
        ...(mobileCardPadding
          ? ({ '--mobile-padding': mobileCardPadding } as React.CSSProperties)
          : {}),
        ...style,
      }}
      {...props}
    />
  )
);

// Inject a tiny style rule for mobile card padding override
if (typeof document !== 'undefined') {
  const id = 'card-mobile-padding';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `@media (max-width:767px){[style*="--mobile-padding"]{padding:var(--mobile-padding)!important}}`;
    document.head.appendChild(style);
  }
}

// ─── SubCard ─────────────────────────────────────────────

interface SubCardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: string;
  withMargin?: string;
  noBackground?: boolean;
}

export const SubCard = forwardRef<HTMLDivElement, SubCardProps>(
  (
    { padding, withMargin, noBackground, color, className, style, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        !noBackground &&
          'bg-white dark:bg-[#151727] border border-[#f0f2f8] dark:border-[#20263d]',
        'hover:shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)]',
        className
      )}
      style={{
        margin: withMargin ?? '0 0 10px 0',
        padding: padding ?? '16px',
        ...(color ? { borderLeft: `2px solid ${color}` } : {}),
        ...style,
      }}
      {...props}
    />
  )
);

// ─── Separation ──────────────────────────────────────────

interface SeparationProps extends HTMLAttributes<HTMLDivElement> {
  height?: number;
  lineColor?: string;
  withMargin?: string;
}

export const Separation = forwardRef<HTMLDivElement, SeparationProps>(
  ({ height, lineColor, withMargin, className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'w-full',
        !lineColor && 'bg-[#f0f2f8] dark:bg-[#212735]',
        className
      )}
      style={{
        height: `${height ?? 1}px`,
        margin: withMargin ?? '16px 0',
        ...(lineColor ? { backgroundColor: lineColor } : {}),
        ...style,
      }}
      {...props}
    />
  )
);

// ─── Typography ──────────────────────────────────────────

interface SubTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  subtitleColor?: string;
  fontWeight?: string;
  inverseColor?: boolean;
}

export const SubTitle = forwardRef<HTMLHeadingElement, SubTitleProps>(
  (
    { subtitleColor, fontWeight, inverseColor, className, style, ...props },
    ref
  ) => (
    <h4
      ref={ref}
      className={cn(
        'my-[5px]',
        !subtitleColor &&
          (inverseColor
            ? 'text-white dark:text-[#212735]'
            : 'text-[#212735] dark:text-white'),
        className
      )}
      style={{
        fontWeight: fontWeight ?? '500',
        ...(subtitleColor ? { color: subtitleColor } : {}),
        ...style,
      }}
      {...props}
    />
  )
);

export const InverseSubtitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      'my-[5px] font-medium text-white dark:text-[#212735]',
      className
    )}
    {...props}
  />
));

export const Sub4Title = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('my-2.5 font-medium', className)} {...props} />
));

export const NoWrapTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('my-2.5 font-medium whitespace-nowrap', className)}
    {...props}
  />
));

interface DarkSubTitleProps extends HTMLAttributes<HTMLDivElement> {
  fontSize?: string;
  withMargin?: string;
}

export const DarkSubTitle = forwardRef<HTMLDivElement, DarkSubTitleProps>(
  ({ fontSize, withMargin, className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-gray-500', className)}
      style={{
        fontSize: fontSize ?? '14px',
        margin: withMargin ?? '0',
        ...style,
      }}
      {...props}
    />
  )
);

export const OverflowText = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-right ml-2 wrap-break-words hyphens-auto md:ml-4',
      className
    )}
    {...props}
  />
));

// ─── Buttons & Links ─────────────────────────────────────

interface SmallButtonProps extends ComponentProps<typeof Button> {
  selected?: boolean;
}

export const SmallButton = forwardRef<HTMLButtonElement, SmallButtonProps>(
  ({ selected, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant={selected ? 'default' : 'secondary'}
      size="xs"
      className={cn('m-[5px]', className)}
      {...props}
    />
  )
);

export const SmallLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'no-underline text-[#9254de] dark:text-[#adc6ff] hover:underline',
      className
    )}
    {...props}
  />
));

export const CopyIcon = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'cursor-pointer ml-1 px-1 rounded-sm hover:bg-[#6284e4] hover:text-white',
      className
    )}
    {...props}
  />
));
