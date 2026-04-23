import { config } from '../../config/thunderhubConfig';

import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Github,
  Heart,
  ShieldCheck,
  Send,
  Twitter,
  Zap,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { ThunderHubMark } from '@/components/branding/ThunderHubMark';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const RESOURCES = [
  {
    href: 'https://docs.thunderhub.io/',
    label: 'Documentation',
    description: 'Setup guides, operational docs, and feature walkthroughs.',
    icon: BookOpen,
  },
];

const COMMUNITY = [
  {
    href: 'https://github.com/apotdevin/thunderhub',
    label: 'GitHub',
    description: 'Source code, issues, releases, and contribution history.',
    icon: Github,
  },
  {
    href: 'https://x.com/thunderhubio',
    label: 'X',
    description: 'Product updates, launches, and project news.',
    icon: Twitter,
  },
  {
    href: 'https://t.me/thunderhub',
    label: 'Telegram',
    description: 'Community chat and project discussion.',
    icon: Send,
  },
];

const SIGNALS = [
  { icon: Zap, label: 'Lightning native' },
  { icon: ShieldCheck, label: 'Self-hosted control' },
  { icon: Activity, label: 'Operational visibility' },
];

const FooterLinkCard = ({
  href,
  label,
  description,
  icon: Icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: typeof BookOpen;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    className="group rounded-lg border border-border/55 bg-card/45 p-2 text-left transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card/70 hover:shadow-[0_10px_22px_-24px_rgba(255,166,0,0.45)]"
  >
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-background/90 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Icon size={12} />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-foreground sm:text-xs">
            {label}
          </div>
          <div className="mt-0.5 max-w-56 text-[10px] leading-snug text-muted-foreground">
            {description}
          </div>
        </div>
      </div>
      <ArrowUpRight
        size={11}
        className="mt-0.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
      />
    </div>
  </a>
);

export const Footer = () => {
  const { pathname } = useLocation();

  return (
    <footer className="border-t border-border/60 bg-background">
      <div
        className={cn(
          'mx-auto px-4',
          pathname === '/login' ? 'max-w-250 lg:px-0' : undefined
        )}
      >
        <div className="relative overflow-hidden rounded-t-[1.1rem] border-x border-border/45 bg-[radial-gradient(circle_at_top,rgba(255,166,0,0.07),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] px-3 py-3 sm:px-4 sm:py-4 lg:px-5">
          <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
            <div className="space-y-3">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <ThunderHubMark />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold tracking-tight text-foreground">
                      ThunderHub
                    </h2>
                    <Badge
                      variant="outline"
                      className="h-4.5 border-primary/25 bg-primary/10 px-1.5 text-[9px] text-primary"
                    >
                      v{config.npmVersion}
                    </Badge>
                  </div>
                  <p className="mt-1 max-w-md text-[11px] leading-snug text-muted-foreground">
                    A calmer control surface for your Lightning node, built for
                    routing, liquidity, swaps, and day-to-day operations.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SIGNALS.map(({ icon: Icon, label }) => (
                  <Badge
                    key={label}
                    variant="outline"
                    className="h-5 rounded-full border-border/65 bg-background/70 px-2 text-[10px] text-muted-foreground"
                  >
                    <Icon size={10} className="text-primary" />
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                {[...RESOURCES, ...COMMUNITY].map(item => (
                  <div
                    key={item.label}
                    className="min-w-0 flex-1 basis-[12rem] sm:basis-[10rem]"
                  >
                    <FooterLinkCard {...item} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-3 bg-border/60" />

          <div className="flex items-center justify-center gap-1 text-center text-[10px] text-muted-foreground">
            <span>Made in Munich with</span>
            <Heart size={10} className="fill-orange-500 text-orange-500" />
            <span>and</span>
            <Zap size={10} className="text-primary" />
            <span>.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
