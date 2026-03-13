import { groupBy } from 'lodash';
import { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Link } from '../../components/link/Link';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import { StoredWidget } from '../dashboard';
import { widgetList } from '../dashboard/widgets/widgetList';
import { WidgetRow } from './WidgetRow';
import { ResponsiveLayouts } from 'react-grid-layout';

export type NormalizedWidgets = {
  id: number;
  name: string;
  group: string;
  active: boolean;
};

const DashPanel = () => {
  const [, setLayouts] = useLocalStorage<ResponsiveLayouts>('layouts', {});
  const [availableWidgets, setAvailableWidgets] = useLocalStorage<
    StoredWidget[]
  >('dashboardWidgets', []);

  const normalizedList: NormalizedWidgets[] = widgetList.reduce((p, w) => {
    if (w.hidden) return p;

    const active =
      availableWidgets.findIndex((a: StoredWidget) => {
        return a.id === w.id;
      }) >= 0;

    return [...p, { ...w, active }];
  }, [] as NormalizedWidgets[]);

  const handleAdd = (id: number) => {
    const filtered = availableWidgets.filter(a => a.id !== id);
    setAvailableWidgets([...filtered, { id }]);
  };

  const handleDelete = (id: number) => {
    const filtered = availableWidgets.filter(a => a.id !== id);
    setAvailableWidgets(filtered);
  };

  const grouped = groupBy(normalizedList, 'group');
  const keys = Object.keys(grouped);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/settings" noStyling>
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} />
            Settings
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link to="/dashboard" noStyling>
            <Button variant="outline" size="sm">
              Dashboard <ChevronRight size={16} />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLayouts({});
              setAvailableWidgets([]);
            }}
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Widgets</CardTitle>
          <CardDescription>
            Toggle widgets to customize your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {keys.map((key, index) => {
            const widgets = grouped[key];
            const subGrouped = groupBy(widgets, 'subgroup');
            const subKeys = Object.keys(subGrouped);

            return subKeys.map((subKey, subIndex) => {
              const subWidgets = subGrouped[subKey];

              return (
                <Fragment key={key + index + subIndex}>
                  {(index > 0 || subIndex > 0) && <Separator />}
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      {subKey ? `${key} — ${subKey}` : key}
                    </h4>
                    <div className="space-y-1">
                      {subWidgets.map(w => (
                        <WidgetRow
                          key={w.id}
                          widget={w}
                          handleAdd={handleAdd}
                          handleDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                </Fragment>
              );
            });
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashPanel;
