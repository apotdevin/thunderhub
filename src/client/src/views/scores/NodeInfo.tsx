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
import {
  getDateDif,
  getFormatDate,
  renderLine,
} from '../../components/generic/helpers';
import { Price } from '../../components/price/Price';

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

  if (!data?.getNode.node || data?.getNode?.node?.alias === 'Node not found') {
    return (
      <CardWithTitle>
        <SubTitle>Node Info</SubTitle>
        <Card>
          <DarkSubTitle>Node not found</DarkSubTitle>
        </Card>
      </CardWithTitle>
    );
  }

  const { alias, channel_count, capacity, updated_at } = data.getNode.node;

  return (
    <CardWithTitle>
      <SubTitle>Node Info</SubTitle>
      <Card>
        <SubTitle>{alias}</SubTitle>
        {renderLine('Channel Count', channel_count)}
        {renderLine('Capacity', <Price amount={capacity} />)}
        {renderLine('Last Update', `${getDateDif(updated_at)} ago`)}
        {renderLine('Last Update Date', getFormatDate(updated_at))}
      </Card>
    </CardWithTitle>
  );
};
