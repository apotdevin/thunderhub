import { FC } from 'react';
import { Switch } from '@/components/ui/switch';
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
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{widget.name}</span>
    <Switch
      checked={widget.active}
      onCheckedChange={checked =>
        checked ? handleAdd(widget.id) : handleDelete(widget.id)
      }
    />
  </div>
);
