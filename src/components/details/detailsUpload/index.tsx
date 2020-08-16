import React, { useEffect } from 'react';
import { useFileReader } from 'src/hooks/UseFileReader';
import { toast } from 'react-toastify';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { useGetChannelsQuery } from 'src/graphql/queries/__generated__/getChannels.generated';
import { CheckCircle, XCircle } from 'react-feather';
import {
  Separation,
  SingleLine,
  DarkSubTitle,
} from 'src/components/generic/Styled';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import styled from 'styled-components';
import { useUpdateMultipleFeesMutation } from 'src/graphql/mutations/__generated__/updateMultipleFees.generated';

const LightSubTitle = styled.div`
  font-size: 14px;
  margin: 2px 0;
`;

type DetailsUploadType = { callback?: () => void };

export const DetailsUpload = ({ callback }: DetailsUploadType) => {
  const [setFile, { data, loading, error }] = useFileReader();

  const { data: channelData, loading: loadingChannels } = useGetChannelsQuery();
  const [
    upload,
    { data: dataUpdate, loading: loadingUpdate },
  ] = useUpdateMultipleFeesMutation({
    onError: () => toast.error('Error Updating Channels'),
    refetchQueries: ['ChannelFees', 'GetChannels'],
  });

  useEffect(() => {
    if (dataUpdate?.updateMultipleFees) {
      toast.success('Channels Updated');
      callback && callback();
    }
  }, [dataUpdate, callback]);

  useEffect(() => {
    if (error) {
      toast.error('Error Reading Details File', {
        pauseOnFocusLoss: false,
      });
    }
  }, [error]);

  if (loading || loadingChannels) {
    return <LoadingCard noCard={true} />;
  }

  if (!channelData?.getChannels?.length) {
    toast.warning('You Have No Channels Open');
    return null;
  }

  if (!data) {
    return (
      <input
        type={'file'}
        name={'file'}
        accept={'.json'}
        onChange={e => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
          }
        }}
      />
    );
  }

  let channels: any[] | null = null;

  try {
    channels = JSON.parse(data);
  } catch (error) {
    toast.error('Error Parsing File');
  }

  if (!channels?.length) {
    toast.warning('No Channels in File');
    return null;
  }

  const channelIds = channelData.getChannels.map(c => c && c.id);

  const finalChannels = channels
    .map(channel => {
      const { id, transaction_id, transaction_vout } = channel;

      if (!transaction_id || !id) return { ...channel, approved: false };
      if (transaction_vout < 0) return { ...channel, approved: false };

      const exists = channelIds.indexOf(id) >= 0;

      if (exists) {
        return { ...channel, approved: true };
      }
      return { ...channel, approved: false };
    })
    .filter(Boolean);

  return (
    <>
      {finalChannels.map(channel => (
        <React.Fragment key={channel.id}>
          <SingleLine>
            {channel.approved ? (
              <LightSubTitle>{channel.alias}</LightSubTitle>
            ) : (
              <DarkSubTitle withMargin={'2px 0'}>{channel.alias}</DarkSubTitle>
            )}
            {channel.approved ? (
              <CheckCircle color={'green'} size={16} />
            ) : (
              <XCircle color={'red'} size={16} />
            )}
          </SingleLine>
        </React.Fragment>
      ))}
      <Separation />
      <ColorButton
        loading={loadingUpdate}
        disabled={loadingUpdate}
        fullWidth={true}
        onClick={() => {
          const channels = finalChannels
            .filter(c => c.approved)
            .map(channel => ({
              alias: channel.alias,
              id: channel.id,
              transaction_id: channel.transaction_id,
              transaction_vout: Number(channel.transaction_vout),
              base_fee_tokens: Number(channel.base_fee_tokens),
              fee_rate: Number(channel.fee_rate),
              cltv_delta: Number(channel.cltv_delta),
              max_htlc_mtokens: `${Number(channel.max_htlc_tokens) * 1000}`,
              min_htlc_mtokens: `${Number(channel.min_htlc_tokens) * 1000}`,
            }));
          upload({ variables: { channels } });
        }}
      >
        Change These Channels
      </ColorButton>
    </>
  );
};
