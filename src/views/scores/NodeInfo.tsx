import React from 'react';
import { useRouter } from 'next/router';
import { useGetNodeQuery } from 'src/graphql/queries/__generated__/getNode.generated';
import { isArray } from 'lodash';
import {
  Card,
  CardWithTitle,
  DarkSubTitle,
  SubTitle,
} from 'src/components/generic/Styled';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import {
  getDateDif,
  getFormatDate,
  renderLine,
} from 'src/components/generic/helpers';
import { Price } from 'src/components/price/Price';
import { useBaseState } from 'src/context/BaseContext';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';

export const NodeInfo = () => {
  const { hasToken } = useBaseState();
  const { query } = useRouter();
  const { id } = query;

  const publicKey = (isArray(id) ? id[0] : id) || '';

  const { data, loading } = useGetNodeQuery({
    skip: !hasToken,
    variables: { publicKey },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!hasToken) {
    return <LoadingCard noTitle={true} />;
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
