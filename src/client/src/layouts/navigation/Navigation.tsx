import { FC } from 'react';
import {
  Home,
  Cpu,
  Server,
  Settings,
  Shield,
  GitPullRequest,
  Link as LinkIcon,
  Users,
  Shuffle,
  Grid,
  Globe,
  Gem,
  ArrowLeftRight,
  ExternalLink,
  Flame,
  LucideProps,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useConfigState } from '../../context/ConfigContext';
import { Link } from '../../components/link/Link';
import { useNodePath } from '../../hooks/useNodeSlug';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { useGetNodeCapabilitiesQuery } from '../../graphql/queries/__generated__/getNodeCapabilities.generated';
import { SideSettings } from './sideSettings/SideSettings';
import { LITD_SETUP_DOCS_URL } from '../../utils/externalLinks';

type Icon = FC<LucideProps>;

const HOME = '/home';
const DASHBOARD = '/dashboard';
const PEERS = '/peers';
const CHANNEL = '/channels';
const TRANS = '/transactions';
const FORWARDS = '/forwards';
const CHAIN_TRANS = '/chain';
const TOOLS = '/tools';
const SETTINGS = '/settings';
const SWAP = '/swap';
const AMBOSS = '/amboss';
const ASSETS = '/assets';
const TRADING = '/trading';
const MAGMA = '/magma';

interface NavItem {
  title: string;
  icon: Icon;
  link?: string;
  href?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const mainNav: NavItem[] = [
  { title: 'Home', link: HOME, icon: Home },
  { title: 'Dashboard', link: DASHBOARD, icon: Grid },
  { title: 'Peers', link: PEERS, icon: Users },
  { title: 'Channels', link: CHANNEL, icon: Cpu },
  { title: 'Transactions', link: TRANS, icon: Server },
  { title: 'Forwards', link: FORWARDS, icon: GitPullRequest },
  { title: 'Chain', link: CHAIN_TRANS, icon: LinkIcon },
  { title: 'Tools', link: TOOLS, icon: Shield },
];

interface NavigationProps {
  isBurger?: boolean;
  setOpen?: (state: boolean) => void;
}

const AMBOSS_SECTION: NavSection = {
  title: 'Amboss',
  items: [
    { title: 'Services', link: AMBOSS, icon: Globe },
    { title: 'Magma', link: MAGMA, icon: Flame },
  ],
};

const ASSETS_SECTION: NavSection = {
  title: 'Taproot Assets',
  items: [
    { title: 'Assets', link: ASSETS, icon: Gem },
    { title: 'Trading', link: TRADING, icon: ArrowLeftRight },
  ],
};

const ASSETS_SETUP_SECTION: NavSection = {
  title: 'Taproot Assets',
  items: [{ title: 'Setup', href: LITD_SETUP_DOCS_URL, icon: Gem }],
};

const TOOLS_SECTION: NavSection = {
  title: 'Tools',
  items: [{ title: 'Swap', link: SWAP, icon: Shuffle }],
};

export const Navigation = ({ isBurger, setOpen }: NavigationProps) => {
  const nodePath = useNodePath();
  const { sidebar } = useConfigState();

  const { data: capData } = useGetNodeCapabilitiesQuery();
  const tapdAvailable =
    capData?.node?.capabilities?.list?.includes('taproot_assets') ?? false;

  const sections: NavSection[] = [
    AMBOSS_SECTION,
    tapdAvailable ? ASSETS_SECTION : ASSETS_SETUP_SECTION,
    TOOLS_SECTION,
  ];

  const renderNavButton = (item: NavItem, open = true) => {
    const isActive = !!item.link && nodePath === item.link;
    const NavIcon = item.icon;
    const key = item.link ?? item.href ?? item.title;

    const content = (
      <div
        className={cn(
          'group relative flex items-center gap-2.5 rounded-md text-xs font-medium transition-colors',
          open ? 'px-2.5 py-1.5' : 'justify-center p-2',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        )}
      >
        <NavIcon size={15} className="shrink-0" />
        {open && (
          <span className="flex flex-1 items-center justify-between">
            {item.title}
            {item.href && (
              <ExternalLink size={11} className="shrink-0 opacity-60" />
            )}
          </span>
        )}
      </div>
    );

    const button = item.href ? (
      <a
        key={key}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
      >
        {content}
      </a>
    ) : (
      <Link key={key} to={item.link}>
        {content}
      </Link>
    );

    if (!open) {
      return (
        <Tooltip key={key}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  const renderBurgerNav = (item: NavItem) => {
    const isActive = !!item.link && nodePath === item.link;
    const NavIcon = item.icon;
    const key = item.link ?? item.href ?? item.title;

    const content = (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        )}
        onClick={() => setOpen && setOpen(false)}
      >
        <NavIcon size={16} />
        <span className="flex flex-1 items-center justify-between">
          {item.title}
          {item.href && (
            <ExternalLink size={12} className="shrink-0 opacity-60" />
          )}
        </span>
      </div>
    );

    if (item.href) {
      return (
        <a
          key={key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
          {content}
        </a>
      );
    }

    return (
      <Link key={key} to={item.link}>
        {content}
      </Link>
    );
  };

  if (isBurger) {
    return (
      <div className="px-4 py-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-3 mb-1">
          Navigation
        </div>
        <nav className="flex flex-col gap-0.5">
          {mainNav.map(item => renderBurgerNav(item))}
        </nav>
        {sections.map(section => (
          <div key={section.title}>
            <div className="my-2 mx-3 h-px bg-border/60" />
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-3 mb-1">
              {section.title}
            </div>
            <nav className="flex flex-col gap-0.5">
              {section.items.map(item => renderBurgerNav(item))}
            </nav>
          </div>
        ))}
        <div className="my-2 mx-3 h-px bg-border/60" />
        <nav className="flex flex-col gap-0.5">
          {renderBurgerNav({
            title: 'Settings',
            link: SETTINGS,
            icon: Settings,
          })}
        </nav>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'hidden md:flex flex-col shrink-0 transition-[width] duration-200 border-r border-border/60',
        sidebar ? 'w-[180px]' : 'w-[52px]'
      )}
    >
      <div className="sticky top-[77px] p-4 pr-2">
        <div className="flex flex-col h-full">
          {sidebar && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-2.5 mb-1">
              Menu
            </div>
          )}
          <nav
            className={cn(
              'flex flex-col gap-0.5 w-full',
              !sidebar && 'items-center'
            )}
          >
            {mainNav.map(item => renderNavButton(item, sidebar))}
          </nav>
          {sections.map(section => (
            <div key={section.title} className="flex flex-col">
              <div
                className={cn(
                  'my-2 h-px bg-border/60',
                  sidebar ? 'mx-2.5' : 'mx-2'
                )}
              />
              {sidebar && (
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-2.5 mb-1">
                  {section.title}
                </div>
              )}
              <nav
                className={cn(
                  'flex flex-col gap-0.5 w-full',
                  !sidebar && 'items-center'
                )}
              >
                {section.items.map(item => renderNavButton(item, sidebar))}
              </nav>
            </div>
          ))}
          <div
            className={cn(
              'my-2 h-px bg-border/60',
              sidebar ? 'mx-2.5' : 'mx-2'
            )}
          />
          <SideSettings />
        </div>
      </div>
    </div>
  );
};
