import { FC, useEffect, useState } from 'react';
import { Cpu, Menu, X, Settings, Heart, LucideProps } from 'lucide-react';
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

export type Icon = FC<LucideProps>;

const SSO = '/sso';
const MAIN = '/login';
const SETTINGS = '/settings';

export const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const {
    openDonate,
    payRequest: donatePayRequest,
    modalOpen: donateModalOpen,
    closeDonate,
  } = useDonate();

  const isRoot = pathname === MAIN || pathname === SSO;

  useEffect(() => {
    if (!isRoot || !open) return;
    setOpen(false);
  }, [isRoot, open]);

  const renderNavButton = (link: string, NavIcon: Icon) => (
    <Link to={link} noStyling={true}>
      <Button variant={'ghost'} size={'icon'}>
        <NavIcon size={18} />
      </Button>
    </Link>
  );

  const renderLoggedIn = () => (
    <>
      <div
        className="flex md:hidden justify-center items-center w-6 h-6"
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </div>
      <div className="hidden md:flex items-center">
        <Button onClick={openDonate} variant={'ghost'} size={'icon'}>
          <Heart size={18} />
        </Button>
        {renderNavButton(SETTINGS, Settings)}
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      <div
        className={cn(
          'dark w-full py-4 px-4 text-foreground bg-background',
          pathname === MAIN && 'bg-transparent'
        )}
      >
        <div
          className={cn(
            pathname === MAIN && 'max-w-[1000px] mx-auto px-4 lg:px-0'
          )}
        >
          <div
            className={cn(
              'flex justify-between items-center',
              !isRoot ? '' : 'w-full flex-col md:w-auto md:flex-row'
            )}
          >
            <Link to={!isRoot ? '/' : '/login'} noStyling>
              <div
                className={cn(
                  'font-extrabold flex items-center justify-center',
                  isRoot && 'mb-4 md:mb-0'
                )}
              >
                <div className="pr-1.5 -mb-1">
                  <Cpu size={18} />
                </div>
                ThunderHub
              </div>
            </Link>
            <div className="flex justify-between items-center">
              {!isRoot && renderLoggedIn()}
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="block md:hidden">
          <BurgerMenu open={open} setOpen={setOpen} />
        </div>
      )}
      <DonateModal
        payRequest={donatePayRequest}
        modalOpen={donateModalOpen}
        closeDonate={closeDonate}
      />
    </>
  );
};
