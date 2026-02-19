import { Spacer } from '../components/spacer/Spacer';
import { ThunderStorm } from '../views/homepage/HomePage.styled';
import { appendBasePath } from '../utils/basePath';
import { TopSection } from '../views/homepage/Top';
import { Accounts } from '../views/homepage/Accounts';

const LoginPage = () => (
  <>
    <ThunderStorm alt={''} src={appendBasePath('/static/thunderstorm.webp')} />
    <TopSection />
    <Accounts />
    <Spacer />
  </>
);

export default LoginPage;
