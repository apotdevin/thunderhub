import { FC } from 'react';
import { SidebarTrade } from '../../layouts/sidebar/SidebarTrade';

/**
 * Standalone wrapper for the order form, used as a grid widget.
 * Reuses SidebarTrade's full logic but without the sidebar chrome.
 */
export const TradingOrderForm: FC = () => {
  return (
    <div className="h-full overflow-auto">
      <SidebarTrade embedded />
    </div>
  );
};
