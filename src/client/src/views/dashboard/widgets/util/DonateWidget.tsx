import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashDispatch } from '../../../../context/DashContext';

export const DonateWidget = () => {
  const dispatch = useDashDispatch();

  return (
    <div className="h-full w-full">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => dispatch({ type: 'openModal', modalType: 'donate' })}
      >
        <div className="flex justify-around items-center">
          <Heart size={18} />
          <div className="text-sm ml-1">Donate</div>
        </div>
      </Button>
    </div>
  );
};
