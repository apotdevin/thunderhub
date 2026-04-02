import { FC, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useNodeSlug } from '@/hooks/useNodeSlug';

const PUBLIC_PATHS = ['/login', '/sso', '/setup'];

interface LinkProps {
  href?: string;
  to?: string;
  color?: string;
  inheritColor?: boolean;
  fullWidth?: boolean;
  noStyling?: boolean;
  newTab?: boolean;
  children?: ReactNode;
}

const getLinkClass = (opts: {
  inheritColor?: boolean;
  color?: string;
  fullWidth?: boolean;
  noStyling?: boolean;
}) => {
  if (opts.noStyling) {
    return 'cursor-pointer no-underline';
  }

  return cn(
    'cursor-pointer no-underline hover:underline hover:decoration-primary hover:decoration-2 hover:underline-offset-2',
    opts.inheritColor ? 'text-inherit' : !opts.color && 'text-foreground',
    opts.fullWidth && 'w-full'
  );
};

export const Link: FC<LinkProps> = ({
  children,
  href,
  to,
  color,
  inheritColor,
  fullWidth,
  noStyling,
  newTab,
}) => {
  const { buildPath, nodeSlug } = useNodeSlug();

  if (!href && !to) return null;

  const className = getLinkClass({ inheritColor, color, fullWidth, noStyling });
  const style = color && !inheritColor ? { color } : undefined;

  if (href) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        {...(newTab && { target: '_blank', rel: 'noreferrer noopener' })}
      >
        {children}
      </a>
    );
  }

  if (to) {
    const isPublic = PUBLIC_PATHS.some(p => to.startsWith(p));
    const resolvedTo =
      nodeSlug && !isPublic && !to.startsWith(`/${nodeSlug}`)
        ? buildPath(to)
        : to;

    return (
      <RouterLink to={resolvedTo} style={{ textDecoration: 'none' }}>
        <span className={className} style={style}>
          {children}
        </span>
      </RouterLink>
    );
  }

  return null;
};
