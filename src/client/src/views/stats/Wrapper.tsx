import { FC, ReactNode, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

type StatWrapperProps = {
  title: string;
  icon: ReactNode;
  count?: number;
  children?: ReactNode;
};

export const StatWrapper: FC<StatWrapperProps> = ({
  children,
  title,
  icon,
  count,
}) => {
  const [open, openSet] = useState(false);

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={() => openSet(p => !p)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle>{title}</CardTitle>
            {count != null && (
              <Badge variant="secondary" className="text-[10px]">
                {count}
              </Badge>
            )}
          </div>
          {open ? (
            <ChevronUp size={16} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={16} className="text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      {open && (
        <CardContent>
          <div className="flex flex-col gap-2">{children}</div>
        </CardContent>
      )}
    </Card>
  );
};
