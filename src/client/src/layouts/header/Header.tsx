import { useState } from 'react';
import {
  Cpu,
  Menu,
  Settings,
  Heart,
  PanelRight,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react';
import { useNodePath } from '../../hooks/useNodeSlug';
import {
  useDonate,
  DonateModal,
} from '../../views/home/quickActions/donate/DonateContent';
import {
  useDeposit,
  DepositModal,
} from '../../views/home/quickActions/exchange/DepositContent';
import {
  useWithdraw,
  WithdrawModal,
} from '../../views/home/quickActions/exchange/WithdrawContent';
import { BurgerMenu } from '../../components/burgerMenu/BurgerMenu';
import { Link } from '../../components/link/Link';
import { cn } from '../../lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { BalancesContent } from '../sidebar/BalancesContent';
import { NodeSwitcher } from '../../components/nodeManager/NodeSwitcher';
import { NodeInfoBar } from './NodeInfoBar';
import { PreferencesPopover } from './PreferencesPopover';

const SSO = '/sso';
const MAIN = '/login';
const SETTINGS = '/settings';

export const Header = () => {
  const nodePath = useNodePath();
  const [open, setOpen] = useState(false);
  const [balancesOpen, setBalancesOpen] = useState(false);

  const {
    openDonate,
    payRequest: donatePayRequest,
    modalOpen: donateModalOpen,
    closeDonate,
  } = useDonate();

  const {
    openDeposit,
    modalOpen: depositModalOpen,
    closeDeposit,
  } = useDeposit();

  const {
    openWithdraw,
    modalOpen: withdrawModalOpen,
    closeWithdraw,
  } = useWithdraw();

  const isRoot = nodePath === MAIN || nodePath === SSO;

  const renderLoggedIn = () => (
    <>
      {/* Mobile controls */}
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
            className="p-0 w-70"
          >
            <BurgerMenu
              setOpen={setOpen}
              openDonate={openDonate}
              openDeposit={openDeposit}
              openWithdraw={openWithdraw}
            />
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

      {/* Desktop controls */}
      <div className="hidden md:flex items-center gap-1">
        <Button
          onClick={openDeposit}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground text-xs h-7 px-2"
        >
          <ArrowDownToLine size={12} className="text-green-500" />
          Deposit
        </Button>
        <Button
          onClick={openWithdraw}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground text-xs h-7 px-2"
        >
          <ArrowUpFromLine size={12} className="text-orange-500" />
          Withdraw
        </Button>

        <div className="w-px h-4 bg-border mx-0.5" />

        <PreferencesPopover />

        {/* Balances sheet for md-to-lg screens (right sidebar unavailable) */}
        <Sheet open={balancesOpen} onOpenChange={setBalancesOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <PanelRight size={14} />
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
            isRoot && 'max-w-250 mx-auto border-transparent'
          )}
        >
          <div className="flex items-center gap-1">
            <Link to={!isRoot ? '/home' : '/login'} noStyling>
              <div className="flex items-center gap-2 font-bold text-sm tracking-tight hover:opacity-80 transition-opacity">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary">
                  <Cpu size={14} />
                </div>
                <span>ThunderHub</span>
              </div>
            </Link>
            {!isRoot && (
              <div className="hidden md:flex items-center">
                <div className="w-px h-4 bg-border mx-1" />
                <NodeSwitcher />
              </div>
            )}
          </div>
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
      <DepositModal modalOpen={depositModalOpen} closeDeposit={closeDeposit} />
      <WithdrawModal
        modalOpen={withdrawModalOpen}
        closeWithdraw={closeWithdraw}
      />
    </>
  );
};
