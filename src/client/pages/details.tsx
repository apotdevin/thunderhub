import React, { useState } from 'react';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { useChannelFeesQuery } from '../src/graphql/queries/__generated__/getChannelFees.generated';
import { getErrorContent } from '../src/utils/error';
import { toast } from 'react-toastify';
import {
  Card,
  CardWithTitle,
  SubTitle,
} from '../src/components/generic/Styled';
import styled from 'styled-components';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { Upload, X, Info } from 'react-feather';
import { DetailsUpload } from '../src/components/details/detailsUpload';
import ReactTooltip from 'react-tooltip';
import { DetailsTable } from '../src/views/details/DetailsTable';
import { useUpdateMultipleFeesMutation } from '../src/graphql/mutations/__generated__/updateMultipleFees.generated';

export const IconCursor = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const IconPadding = styled.div`
  padding-left: 4px;
`;

const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Detail = () => {
  const [willUpload, setWillUpload] = useState<boolean>(false);

  const { loading, data } = useChannelFeesQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const [upload, { loading: loadingUpdate }] = useUpdateMultipleFeesMutation({
    onError: () => toast.error('Error Updating Channels'),
    onCompleted: () => toast.success('Channels Updated'),
    refetchQueries: ['ChannelFees', 'GetChannels'],
  });

  if (loading) {
    return <LoadingCard title={'Channel Details'} />;
  }

  if (!data?.getChannels?.length) {
    return (
      <CardWithTitle>
        <CardTitleRow>
          <SubTitle>
            <IconCursor>Channel Details</IconCursor>
          </SubTitle>
        </CardTitleRow>
        <Card>No channels opened</Card>
      </CardWithTitle>
    );
  }

  return (
    <CardWithTitle>
      <CardTitleRow>
        <SubTitle>
          <IconCursor>
            Channel Details
            <IconPadding>
              <Info size={16} data-tip data-for={'channel_details_info'} />
            </IconPadding>
          </IconCursor>
        </SubTitle>
        <IconCursor onClick={() => setWillUpload(p => !p)}>
          {willUpload ? <X size={16} /> : <Upload size={16} />}
        </IconCursor>
      </CardTitleRow>
      {willUpload && (
        <Card>
          <DetailsUpload
            loading={loadingUpdate}
            upload={channels => {
              upload({ variables: { channels } });
              setWillUpload(false);
            }}
          />
        </Card>
      )}
      <Card cardPadding={'0'}>
        <DetailsTable channels={data.getChannels} />
      </Card>
      <ReactTooltip
        id={'channel_details_info'}
        effect={'solid'}
        place={'right'}
      >
        <div>Select channels that you want to download details from.</div>
        This file can later be used to update these same channels.
      </ReactTooltip>
    </CardWithTitle>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <Detail />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
