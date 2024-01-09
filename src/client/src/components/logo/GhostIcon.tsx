import { forwardRef } from 'react';

export const GhostLogo = forwardRef<any, any>(
  ({ color = 'currentColor', size = 100, children, ...rest }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        fill={color}
        viewBox="0 0 100 100"
        {...rest}
      >
        {children}
        <path d="M50 1C22.9 1 1 22.9 1 50v36.8C1 93.5 6.5 99 13.2 99s12.3-5.5 12.3-12.3C25.5 93.5 31 99 37.7 99 44.5 99 50 93.5 50 86.8 50 93.5 55.5 99 62.3 99c6.8 0 12.3-5.5 12.3-12.3C74.5 93.5 80 99 86.8 99 93.5 99 99 93.5 99 86.8V50C99 22.9 77.1 1 50 1z" />
      </svg>
    );
  }
);

GhostLogo.displayName = 'GhostLogo';
