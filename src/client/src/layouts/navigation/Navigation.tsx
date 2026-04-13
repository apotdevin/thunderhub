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
  BarChart2,
  Shuffle,
  Grid,
  Globe,
  Gem,
  ArrowLeftRight,
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

type Icon = FC<LucideProps>;

const HOME = '/home';
const DASHBOARD = '/dashboard';
const PEERS = '/peers';
const CHANNEL = '/channels';
const TRANS = '/transactions';
const FORWARDS = '/forwards';
const CHAIN_TRANS = '/chain';
const TOOLS = '/tools';
const STATS = '/stats';
const SETTINGS = '/settings';
const SWAP = '/swap';
const AMBOSS = '/amboss';
const ASSETS = '/assets';
const TRADING = '/trading';

interface NavItem {
  title: string;
  link: string;
  icon: Icon;
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

const secondaryNavItems: NavItem[] = [
  { title: 'Assets', link: ASSETS, icon: Gem },
  { title: 'Trading', link: TRADING, icon: ArrowLeftRight },
  { title: 'Amboss', link: AMBOSS, icon: Globe },
  { title: 'Swap', link: SWAP, icon: Shuffle },
  { title: 'Stats', link: STATS, icon: BarChart2 },
];

export const Navigation = ({ isBurger, setOpen }: NavigationProps) => {
  const nodePath = useNodePath();
  const { sidebar } = useConfigState();

  const { data: capData } = useGetNodeCapabilitiesQuery();
  const tapdAvailable =
    capData?.getNodeCapabilities?.capabilities?.includes('taproot_assets') ??
    false;

  const secondaryNav: NavItem[] = secondaryNavItems.filter(
    item => item.link !== ASSETS || tapdAvailable
  );

  const renderNavButton = (item: NavItem, open = true) => {
    const isActive = nodePath === item.link;
    const NavIcon = item.icon;

    const button = (
      <Link key={item.link} to={item.link}>
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
          {open && <span>{item.title}</span>}
        </div>
      </Link>
    );

    if (!open) {
      return (
        <Tooltip key={item.link}>
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
    const isActive = nodePath === item.link;
    const NavIcon = item.icon;

    return (
      <Link key={item.link} to={item.link}>
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
          <span>{item.title}</span>
        </div>
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
        <div className="my-2 mx-3 h-px bg-border/60" />
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-3 mb-1">
          Tools
        </div>
        <nav className="flex flex-col gap-0.5">
          {secondaryNav.map(item => renderBurgerNav(item))}
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
          <div
            className={cn(
              'my-2 h-px bg-border/60',
              sidebar ? 'mx-2.5' : 'mx-2'
            )}
          />
          {sidebar && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-2.5 mb-1">
              Tools
            </div>
          )}
          <nav
            className={cn(
              'flex flex-col gap-0.5 w-full',
              !sidebar && 'items-center'
            )}
          >
            {secondaryNav.map(item => renderNavButton(item, sidebar))}
          </nav>
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
