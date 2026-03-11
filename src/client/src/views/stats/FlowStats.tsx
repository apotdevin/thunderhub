import { Fragment, useState, useEffect } from 'react';
import { useGetVolumeHealthQuery } from '../../graphql/queries/__generated__/getVolumeHealth.generated';
import {
  SubCard,
  DarkSubTitle,
  SubTitle,
  Separation,
  ResponsiveLine,
} from '../../components/generic/Styled';
import { sortBy } from 'lodash';
import { renderLine } from '../../components/generic/helpers';
import { ChannelHealth } from '../../graphql/types';
import { useStatsDispatch } from './context';
import { chartColors } from '../../styles/Themes';
import { StatWrapper } from './Wrapper';
import { getIcon, getVolumeMessage, getProgressColor } from './helpers';

type VolumeStatCardProps = {
  channel: ChannelHealth;
  index: number;
  open: boolean;
  openSet: (index: number) => void;
};

const VolumeStatCard = ({
  channel,
  open,
  openSet,
  index,
}: VolumeStatCardProps) => {
  const message = getVolumeMessage(channel.score);
  const renderContent = () => (
    <>
      <Separation />
      <DarkSubTitle
        className="w-full text-center"
        style={{ color: getProgressColor(channel.score) || chartColors.orange }}
      >
        {message}
      </DarkSubTitle>
      {renderLine('Flow (sats/block):', channel.volumeNormalized)}
      {renderLine(
        'Average Flow (sats/block):',
        channel.averageVolumeNormalized
      )}
    </>
  );
  return (
    <Fragment key={channel.id || ''}>
      <SubCard>
        <div
          className="cursor-pointer"
          onClick={() => openSet(open ? 0 : index)}
        >
          <ResponsiveLine>
            <SubTitle>{channel?.partner?.node?.alias}</SubTitle>
            <div className="flex justify-between mt-2 w-full md:mt-0 md:w-40">
              <DarkSubTitle>{'Score'}</DarkSubTitle>
              {channel.score}
              {getIcon(channel.score)}
            </div>
          </ResponsiveLine>
        </div>
        {open && renderContent()}
      </SubCard>
    </Fragment>
  );
};

export const VolumeStats = () => {
  const [open, openSet] = useState(0);
  const dispatch = useStatsDispatch();
  const { data, loading } = useGetVolumeHealthQuery();

  useEffect(() => {
    if (data && data.getVolumeHealth) {
      dispatch({
        type: 'change',
        state: { volumeScore: data.getVolumeHealth.score },
      });
    }
  }, [data, dispatch]);

  if (loading || !data?.getVolumeHealth?.channels?.length) {
    return null;
  }

  const sortedArray = sortBy(data.getVolumeHealth.channels, 'score');

  return (
    <StatWrapper title={'Flow Stats'}>
      {sortedArray.map((channel, index) => (
        <VolumeStatCard
          key={channel?.id || ''}
          channel={channel as ChannelHealth}
          open={index + 1 === open}
          openSet={openSet}
          index={index + 1}
        />
      ))}
    </StatWrapper>
  );
};
