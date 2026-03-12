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
  LucideProps,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useConfigState } from '../../context/ConfigContext';
import { Link } from '../../components/link/Link';
import { SideSettings } from './sideSettings/SideSettings';
import { NodeInfo } from './nodeInfo/NodeInfo';

type Icon = FC<LucideProps>;

const HOME = '/';
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

interface NavigationProps {
  isBurger?: boolean;
  setOpen?: (state: boolean) => void;
}

export const Navigation = ({ isBurger, setOpen }: NavigationProps) => {
  const { pathname } = useLocation();
  const { sidebar } = useConfigState();

  const isRoot = pathname === '/login' || pathname === '/sso';

  const renderNavButton = (
    title: string,
    link: string,
    NavIcon: Icon,
    open = true
  ) => (
    <Link to={link}>
      <div
        className={cn(
          'p-1 rounded flex items-center w-full no-underline my-1',
          pathname === link
            ? 'bg-white dark:bg-[#151727] text-[#212735] dark:text-white'
            : 'text-gray-500',
          !sidebar && 'justify-center',
          'hover:text-[#212735] hover:dark:text-white hover:bg-white hover:dark:bg-[#151727]'
        )}
      >
        <NavIcon size={18} />
        {open && <div className="ml-2 text-sm">{title}</div>}
      </div>
    </Link>
  );

  const renderBurgerNav = (title: string, link: string, NavIcon: Icon) => (
    <Link to={link}>
      <div
        className={cn(
          'flex flex-col items-center justify-center px-4 pt-4 pb-2 rounded no-underline',
          pathname === link
            ? 'bg-white dark:bg-[#151727] text-[#212735] dark:text-white'
            : 'text-gray-500'
        )}
        onClick={() => setOpen && setOpen(false)}
      >
        <NavIcon />
        {title}
      </div>
    </Link>
  );

  const renderLinks = () => (
    <div className={cn('w-full', !sidebar && 'my-2')}>
      {renderNavButton('Home', HOME, Home, sidebar)}
      {renderNavButton('Dashboard', DASHBOARD, Grid, sidebar)}
      {renderNavButton('Peers', PEERS, Users, sidebar)}
      {renderNavButton('Channels', CHANNEL, Cpu, sidebar)}
      {renderNavButton('Transactions', TRANS, Server, sidebar)}
      {renderNavButton('Forwards', FORWARDS, GitPullRequest, sidebar)}
      {renderNavButton('Chain', CHAIN_TRANS, LinkIcon, sidebar)}
      {renderNavButton('Amboss', AMBOSS, Globe, sidebar)}
      {renderNavButton('Tools', TOOLS, Shield, sidebar)}
      {renderNavButton('Swap', SWAP, Shuffle, sidebar)}
      {renderNavButton('Stats', STATS, BarChart2, sidebar)}
    </div>
  );

  const renderBurger = () => (
    <div className="flex justify-start items-center overflow-scroll bg-[#f0f2f8] dark:bg-[#20263d] -mx-4 px-4 py-4">
      {renderBurgerNav('Home', HOME, Home)}
      {renderBurgerNav('Dashboard', DASHBOARD, Grid)}
      {renderBurgerNav('Peers', PEERS, Users)}
      {renderBurgerNav('Channels', CHANNEL, Cpu)}
      {renderBurgerNav('Transactions', TRANS, Server)}
      {renderBurgerNav('Forwards', FORWARDS, GitPullRequest)}
      {renderBurgerNav('Chain', CHAIN_TRANS, LinkIcon)}
      {renderBurgerNav('Amboss', AMBOSS, Globe)}
      {renderBurgerNav('Tools', TOOLS, Shield)}
      {renderBurgerNav('Swap', SWAP, Shuffle)}
      {renderBurgerNav('Stats', STATS, BarChart2)}
      {renderBurgerNav('Settings', SETTINGS, Settings)}
    </div>
  );

  if (isBurger) {
    return renderBurger();
  }

  return (
    <div
      className="[grid-area:nav] hidden md:block"
      style={{ width: sidebar ? '200px' : '60px' }}
    >
      <div className="sticky top-4">
        <div className="flex flex-col items-start py-2">
          {!isRoot && <NodeInfo isOpen={sidebar} />}
          {renderLinks()}
          <SideSettings />
        </div>
      </div>
    </div>
  );
};
