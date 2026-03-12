import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DarkSubTitle } from '../../components/generic/Styled';
import { NormalizedWidgets } from './DashPanel';

type WidgetRowParams = {
  widget: NormalizedWidgets;
  handleAdd: (id: number) => void;
  handleDelete: (id: number) => void;
};

export const WidgetRow: FC<WidgetRowParams> = ({
  widget,
  handleAdd,
  handleDelete,
}) => (
  <div className="mb-2 flex justify-between items-center">
    <DarkSubTitle>{widget.name}</DarkSubTitle>
    <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
      <Button
        variant={widget.active ? 'default' : 'ghost'}
        onClick={() => handleAdd(widget.id)}
        className={cn('grow', !widget.active && 'text-foreground')}
      >
        Show
      </Button>
      <Button
        variant={!widget.active ? 'default' : 'ghost'}
        onClick={() => handleDelete(widget.id)}
        className={cn('grow', widget.active && 'text-foreground')}
      >
        Hide
      </Button>
    </div>
  </div>
);
