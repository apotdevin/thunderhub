import * as React from 'react';
import { useGetLatestVersionQuery } from '../../../src/graphql/queries/__generated__/getLatestVersion.generated';
import { config } from '../../config/thunderhubConfig';
import styled from 'styled-components';
import { Link } from '../link/Link';

const VersionBox = styled.div`
  width: 100%;
  text-align: center;
  font-size: 14px;
  opacity: 0.3;
  cursor: pointer;

  &:hover {
    opacity: 1;
    color: white;
  }
`;

const { npmVersion, noVersionCheck } = config;

export const Version = () => {
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
      <VersionBox>{`Version ${githubVersion} is available. You are on version ${npmVersion}`}</VersionBox>
    </Link>
  );
};
