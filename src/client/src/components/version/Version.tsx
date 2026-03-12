import { useGetLatestVersionQuery } from '@/graphql/queries/__generated__/getLatestVersion.generated';
import { config } from '../../config/thunderhubConfig';
import { Link } from '../link/Link';

export const Version = () => {
  const { npmVersion, noVersionCheck } = config;

  const { data, loading, error } = useGetLatestVersionQuery({
    skip: noVersionCheck,
  });

  if (noVersionCheck) {
    return null;
  }

  if (error || !data || loading || !data?.getLatestVersion) {
    return null;
  }

  const githubVersion = data.getLatestVersion.replace('v', '');
  const version = githubVersion.split('.').map(Number);
  const localVersion = npmVersion.split('.').map(Number);

  const newVersionAvailable =
    version[0] > localVersion[0] ||
    version[1] > localVersion[1] ||
    version[2] > localVersion[2];

  if (!newVersionAvailable) {
    return null;
  }

  return (
    <Link
      href={'https://docs.thunderhub.io/installation#updating'}
      newTab={true}
    >
      <div className="w-full text-center text-sm cursor-pointer text-muted-foreground">
        {`Version ${githubVersion} is available. You are on version ${npmVersion}`}
      </div>
    </Link>
  );
};
