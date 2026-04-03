import { useNavigate } from 'react-router-dom';
import { appendBasePath } from '../utils/basePath';
import { TopSection } from '../views/homepage/Top';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AddNodeForm } from '@/components/nodeManager/AddNodeForm';

const NodeSetupPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <img
        alt=""
        src={appendBasePath('/static/thunderstorm.webp')}
        className="absolute inset-0 z-[-1] h-72 w-full object-cover bg-background"
      />
      <div className="flex flex-col gap-6 pb-12 pt-8">
        <TopSection />
        <div className="mx-auto w-full max-w-md px-4">
          <Card>
            <CardHeader>
              <CardTitle>Connect a Node</CardTitle>
              <CardDescription>
                Add your Lightning node connection details to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddNodeForm onNodeAdded={slug => navigate(`/${slug}/home`)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NodeSetupPage;
