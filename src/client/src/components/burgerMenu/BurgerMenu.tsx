import { NodeInfo } from '../../layouts/navigation/nodeInfo/NodeInfo';
import { SideSettings } from '../../layouts/navigation/sideSettings/SideSettings';
import { Navigation } from '../../layouts/navigation/Navigation';
import { LogoutButton } from '../logoutButton';
import { cn } from '@/lib/utils';

interface BurgerProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}

export const BurgerMenu = ({ open, setOpen }: BurgerProps) => {
  return (
    <div
      className={cn(
        'px-4 pt-4 bg-card shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)]',
        open && 'mb-4'
      )}
    >
      <NodeInfo isBurger={true} />
      <SideSettings isBurger={true} />
      <Navigation isBurger={true} setOpen={setOpen} />
      <LogoutButton
        variant="outline"
        size="default"
        className="w-full my-4"
        label="Logout"
      />
    </div>
  );
};
