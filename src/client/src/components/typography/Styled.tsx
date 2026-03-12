import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export const Center = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-center items-center text-center', className)}
    {...props}
  />
));

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  textColor?: string;
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ textColor, className, style, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        'w-full text-center text-2xl md:text-[40px]',
        !textColor && 'text-[#e1e6ed]',
        className
      )}
      style={{
        ...(textColor ? { color: textColor } : {}),
        ...style,
      }}
      {...props}
    />
  )
);

export const SectionTitle = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ textColor, className, style, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-2xl', !textColor && 'text-[#ccd0e7]', className)}
      style={{
        ...(textColor ? { color: textColor } : {}),
        ...style,
      }}
      {...props}
    />
  )
);

export const Subtitle = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ textColor, className, style, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'text-base max-w-[600px]',
        !textColor && 'text-[#ccd0e7]',
        className
      )}
      style={{
        ...(textColor ? { color: textColor } : {}),
        ...style,
      }}
      {...props}
    />
  )
);

export const Question = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-[#4a5669]', className)} {...props} />
));

export const Text = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-[#667587] text-justify', className)}
    {...props}
  />
));

export const SmallText = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-[#212735] dark:text-white text-start', className)}
    {...props}
  />
));

export const BulletPoint = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-[#667587] text-justify ml-8', className)}
    {...props}
  />
));

export const DetailCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-white dark:bg-[#1a1f35] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-[#f0f2f8] dark:border-[#20263d] w-full',
      'm-[8px_16px] z-[1] flex-[1_0_100%] md:flex-[1_0_30%]',
      className
    )}
    style={{ padding: '16px', marginBottom: 0 }}
    {...props}
  />
));

export const DetailLine = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mx-0 flex justify-center items-center flex-wrap md:mx-[-16px]',
      className
    )}
    {...props}
  />
));

export const IconTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex text-[#212735] dark:text-white', className)}
    {...props}
  />
));

export const IconMargin = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('mr-1', className)} {...props} />
));
