import { Button } from '@/components/ui/button';
import { useDashDispatch } from '../../../../context/DashContext';

export const SignWidget = () => {
  const dispatch = useDashDispatch();

  return (
    <div className="h-full w-full">
      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          dispatch({ type: 'openModal', modalType: 'signMessage' })
        }
      >
        Sign Message
      </Button>
    </div>
  );
};
