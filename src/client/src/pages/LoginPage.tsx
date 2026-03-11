import { appendBasePath } from '../utils/basePath';
import { TopSection } from '../views/homepage/Top';
import { Accounts } from '../views/homepage/Accounts';

const LoginPage = () => (
  <>
    <img
      alt={''}
      src={appendBasePath('/static/thunderstorm.webp')}
      className="h-80 w-full top-0 object-cover absolute z-[-1] bg-[#151727]"
    />
    <TopSection />
    <Accounts />
  </>
);

export default LoginPage;
