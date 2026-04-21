import {
  Sun,
  Moon,
  Monitor,
  PanelLeft,
  PanelRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';
import { usePriceState } from '../../context/PriceContext';
export const PreferencesPopover = () => {
  const { theme, currency, sidebar, rightSidebar } = useConfigState();
  const dispatch = useConfigDispatch();
  const { dontShow } = usePriceState();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-3">
        <div className="flex flex-col gap-3">
          {/* Currency */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Currency
            </div>
            <ToggleGroup
              type="single"
              value={currency}
              onValueChange={value => {
                if (value) dispatch({ type: 'change', currency: value });
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <ToggleGroupItem value="sat" className="text-xs flex-1">
                sat
              </ToggleGroupItem>
              <ToggleGroupItem value="btc" className="text-xs flex-1 font-bold">
                &#x20bf;
              </ToggleGroupItem>
              {!dontShow && (
                <ToggleGroupItem
                  value="fiat"
                  className="text-xs flex-1 font-bold"
                >
                  F
                </ToggleGroupItem>
              )}
            </ToggleGroup>
          </div>

          {/* Theme */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Theme
            </div>
            <ToggleGroup
              type="single"
              value={theme}
              onValueChange={value => {
                if (value) dispatch({ type: 'themeChange', theme: value });
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <ToggleGroupItem value="light" className="flex-1 gap-1">
                <Sun size={12} />
                Light
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" className="flex-1 gap-1">
                <Moon size={12} />
                Dark
              </ToggleGroupItem>
              <ToggleGroupItem value="system" className="flex-1 gap-1">
                <Monitor size={12} />
                Auto
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Layout */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Layout
            </div>
            <div className="flex gap-1">
              <Button
                onClick={() => dispatch({ type: 'change', sidebar: !sidebar })}
                variant={sidebar ? 'secondary' : 'ghost'}
                size="sm"
                className="flex-1 gap-1 text-xs h-7"
              >
                <PanelLeft size={12} />
                Left
              </Button>
              <Button
                onClick={() =>
                  dispatch({
                    type: 'change',
                    rightSidebar: !rightSidebar,
                  })
                }
                variant={rightSidebar ? 'secondary' : 'ghost'}
                size="sm"
                className="hidden lg:inline-flex flex-1 gap-1 text-xs h-7"
              >
                <PanelRight size={12} />
                Right
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
