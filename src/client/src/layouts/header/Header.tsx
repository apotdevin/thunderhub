import { FC, useState } from 'react';
import {
  Cpu,
  Menu,
  Settings,
  Heart,
  Sun,
  Moon,
  Monitor,
  PanelLeft,
  PanelRight,
  LucideProps,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { LogoutButton } from '../../components/logoutButton';
import {
  useDonate,
  DonateModal,
} from '../../views/home/quickActions/donate/DonateContent';
import { BurgerMenu } from '../../components/burgerMenu/BurgerMenu';
import { Link } from '../../components/link/Link';
import { cn } from '../../lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';
import { usePriceState } from '../../context/PriceContext';
import { NodeInfoBar } from './NodeInfoBar';
import { BalancesContent } from '../sidebar/BalancesContent';

export type Icon = FC<LucideProps>;

const SSO = '/sso';
const MAIN = '/login';
const SETTINGS = '/settings';

export const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [balancesOpen, setBalancesOpen] = useState(false);

  const { theme, currency, sidebar, rightSidebar } = useConfigState();
  const dispatch = useConfigDispatch();
  const { dontShow } = usePriceState();

  const {
    openDonate,
    payRequest: donatePayRequest,
    modalOpen: donateModalOpen,
    closeDonate,
  } = useDonate();

  const isRoot = pathname === MAIN || pathname === SSO;

  const renderLoggedIn = () => (
    <>
      <div className="md:hidden text-muted-foreground flex">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <Menu size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={true}
            className="p-0 w-[280px]"
          >
            <BurgerMenu setOpen={setOpen} openDonate={openDonate} />
          </SheetContent>
        </Sheet>

        <Sheet open={balancesOpen} onOpenChange={setBalancesOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <PanelRight size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={true}
            className="p-0 w-[320px]"
          >
            <div className="pt-4">
              <BalancesContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:flex items-center gap-1">
        {/* Currency toggle */}
        <ToggleGroup
          type="single"
          value={currency}
          onValueChange={value => {
            if (value) dispatch({ type: 'change', currency: value });
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="sat" className="text-xs px-1.5">
            sat
          </ToggleGroupItem>
          <ToggleGroupItem value="btc" className="text-xs px-1.5 font-bold">
            ₿
          </ToggleGroupItem>
          {!dontShow && (
            <ToggleGroupItem value="fiat" className="text-xs px-1.5 font-bold">
              F
            </ToggleGroupItem>
          )}
        </ToggleGroup>

        {/* Theme toggle */}
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={value => {
            if (value) dispatch({ type: 'themeChange', theme: value });
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="light" className="px-1.5">
            <Sun size={12} />
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" className="px-1.5">
            <Moon size={12} />
          </ToggleGroupItem>
          <ToggleGroupItem value="system" className="px-1.5">
            <Monitor size={12} />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="w-px h-4 bg-border mx-0.5" />

        <Button
          onClick={() => dispatch({ type: 'change', sidebar: !sidebar })}
          variant="ghost"
          size="icon-sm"
          className={cn(
            'hover:text-foreground',
            sidebar ? 'text-foreground' : 'text-muted-foreground/40'
          )}
        >
          <PanelLeft size={14} />
        </Button>

        <Button
          onClick={() =>
            dispatch({ type: 'change', rightSidebar: !rightSidebar })
          }
          variant="ghost"
          size="icon-sm"
          className={cn(
            'hidden lg:flex hover:text-foreground',
            rightSidebar ? 'text-foreground' : 'text-muted-foreground/40'
          )}
        >
          <PanelRight size={14} />
        </Button>

        <Sheet open={balancesOpen} onOpenChange={setBalancesOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden text-muted-foreground"
            >
              <PanelRight size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            showCloseButton={true}
            className="p-0 w-[320px]"
          >
            <div className="pt-4">
              <BalancesContent />
            </div>
          </SheetContent>
        </Sheet>

        <div className="w-px h-4 bg-border mx-0.5" />

        <Button
          onClick={openDonate}
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Heart size={14} className="text-red-500 fill-red-500" />
        </Button>
        <Link to={SETTINGS} noStyling>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings size={14} />
          </Button>
        </Link>
        <div className="w-px h-4 bg-border mx-0.5" />
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60',
          isRoot && 'bg-transparent backdrop-blur-none'
        )}
      >
        <div
          className={cn(
            'flex h-10 items-center justify-between px-4 border-b border-border/60',
            isRoot && 'max-w-[1000px] mx-auto border-transparent'
          )}
        >
          <Link to={!isRoot ? '/' : '/login'} noStyling>
            <div className="flex items-center gap-2 font-bold text-sm tracking-tight hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary">
                <Cpu size={14} />
              </div>
              <span>ThunderHub</span>
            </div>
          </Link>
          {!isRoot && renderLoggedIn()}
        </div>
        {!isRoot && (
          <div className="hidden md:block border-b border-border/40">
            <NodeInfoBar />
          </div>
        )}
      </header>
      <DonateModal
        payRequest={donatePayRequest}
        modalOpen={donateModalOpen}
        closeDonate={closeDonate}
      />
    </>
  );
};
