import {
  Sun,
  Moon,
  Monitor,
  Heart,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react';
import { NodeInfo } from '../../layouts/navigation/nodeInfo/NodeInfo';
import { Navigation } from '../../layouts/navigation/Navigation';
import { LogoutButton } from '../logoutButton';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';
import { usePriceState } from '../../context/PriceContext';
import { NodeSwitcher } from '../nodeManager/NodeSwitcher';

interface BurgerProps {
  setOpen: (state: boolean) => void;
  openDonate?: () => void;
  openDeposit?: () => void;
  openWithdraw?: () => void;
}

export const BurgerMenu = ({
  setOpen,
  openDonate,
  openDeposit,
  openWithdraw,
}: BurgerProps) => {
  const { theme, currency } = useConfigState();
  const dispatch = useConfigDispatch();
  const { dontShow } = usePriceState();

  return (
    <div className="flex flex-col h-full pt-10">
      <div className="px-4 py-4">
        <NodeInfo isBurger={true} />
      </div>
      <Separator />
      <div className="px-4 py-2">
        <NodeSwitcher />
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto">
        <Navigation isBurger={true} setOpen={setOpen} />
      </div>
      <Separator />
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
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
              <ToggleGroupItem
                value="fiat"
                className="text-xs px-1.5 font-bold"
              >
                F
              </ToggleGroupItem>
            )}
          </ToggleGroup>
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
        </div>
        <div className="flex gap-2">
          {openDeposit && (
            <Button
              onClick={() => {
                openDeposit();
                setOpen(false);
              }}
              variant="outline"
              size="default"
              className="flex-1"
            >
              <ArrowDownToLine size={14} />
              <span>Deposit</span>
            </Button>
          )}
          {openWithdraw && (
            <Button
              onClick={() => {
                openWithdraw();
                setOpen(false);
              }}
              variant="outline"
              size="default"
              className="flex-1"
            >
              <ArrowUpFromLine size={14} />
              <span>Withdraw</span>
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {openDonate && (
            <Button
              onClick={() => {
                openDonate();
                setOpen(false);
              }}
              variant="outline"
              size="default"
              className="flex-1"
            >
              <Heart size={14} />
              <span>Donate</span>
            </Button>
          )}
          <LogoutButton
            variant="outline"
            size="default"
            className="flex-1"
            label="Logout"
          />
        </div>
      </div>
    </div>
  );
};
