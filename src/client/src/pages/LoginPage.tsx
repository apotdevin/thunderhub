import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appendBasePath } from '../utils/basePath';
import { TopSection } from '../views/homepage/Top';
import { Accounts } from '../views/homepage/Accounts';
import { config } from '@/config/thunderhubConfig';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (config.needsSetup) {
      navigate('/setup');
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen">
      <img
        alt=""
        src={appendBasePath('/static/thunderstorm.webp')}
        className="absolute inset-0 z-[-1] h-72 w-full object-cover bg-background"
      />
      <div className="flex flex-col gap-6 pb-12 pt-8">
        <TopSection />
        <Accounts />
      </div>
    </div>
  );
};

export default LoginPage;
