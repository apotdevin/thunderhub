import { useCheckAuthToken } from '../hooks/UseCheckAuthToken';
import { LoadingCard } from '../components/loading/LoadingCard';

const SsoPage = () => {
  useCheckAuthToken();
  return <LoadingCard noCard={true} loadingHeight={'80vh'} />;
};

export default SsoPage;
