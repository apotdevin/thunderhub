import React from 'react';
import { useRouter } from 'next/router';
import { useGetNodeQuery } from '../../graphql/queries/__generated__/getNode.generated';
import { isArray } from 'lodash';
import {
  Card,
  CardWithTitle,
  DarkSubTitle,
  SubTitle,
} from '../../components/generic/Styled';
import { LoadingCard } from '../../components/loading/LoadingCard';

import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { useAmbossUser } from '../../hooks/UseAmbossUser';

export const NodeInfo = () => {
  const { user } = useAmbossUser();
  const { query } = useRouter();
  const { id } = query;

  const publicKey = (isArray(id) ? id[0] : id) || '';

  const { data, loading } = useGetNodeQuery({
    skip: !user?.subscribed || !publicKey,
    variables: { publicKey },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!user?.subscribed) {
    return null;
  }

  if (loading) {
    return <LoadingCard title={'Node Info'} />;
  }

  if (!data?.getNode.node?.alias) {
    return (
      <CardWithTitle>
        <SubTitle>Node Info</SubTitle>
        <Card>
          <DarkSubTitle>Node not found</DarkSubTitle>
        </Card>
      </CardWithTitle>
    );
  }

  const { alias } = data.getNode.node;

  return (
    <CardWithTitle>
      <SubTitle>Node Info</SubTitle>
      <Card>
        <SubTitle>{alias}</SubTitle>
      </Card>
    </CardWithTitle>
  );
};
