import * as React from 'react';
import { useAccountState } from 'src/context/AccountContext';
import { useGetFeeHealthQuery } from 'src/graphql/queries/__generated__/getFeeHealth.generated';
import {
  SubCard,
  DarkSubTitle,
  Separation,
  ResponsiveLine,
} from 'src/components/generic/Styled';
import { ChannelFeeHealth } from 'src/graphql/types';
import { sortBy } from 'underscore';
import { renderLine } from 'src/components/generic/helpers';
import { useStatsDispatch } from './context';
import { ScoreLine, Clickable, WarningText } from './styles';
import { StatWrapper } from './Wrapper';
import { getIcon, getFeeMessage, getProgressColor } from './helpers';

type FeeStatCardProps = {
  channel: ChannelFeeHealth;
  index: number;
  open: boolean;
  openSet: (index: number) => void;
  myStats?: boolean;
};

const FeeStatCard = ({
  channel,
  myStats,
  open,
  openSet,
  index,
}: FeeStatCardProps) => {
  const renderContent = () => {
    const stats = myStats ? channel.mySide : channel.partnerSide;
    const { score } = stats || {};

    return (
      <ScoreLine>
        <DarkSubTitle>Score</DarkSubTitle>
        {score}
        {getIcon(score)}
      </ScoreLine>
    );
  };

  const renderDetails = () => {
    const stats = myStats ? channel.mySide : channel.partnerSide;
    const { rate, base, rateScore, baseScore, rateOver, baseOver } =
      stats || {};

    const message = getFeeMessage(rateScore, rateOver);
    const baseMessage = getFeeMessage(Number(baseScore), baseOver, true);
    return (
      <>
        <Separation />
        <WarningText warningColor={getProgressColor(rateScore)}>
          {message}
        </WarningText>
        <WarningText warningColor={getProgressColor(baseScore)}>
          {baseMessage}
        </WarningText>
        {renderLine('Fee Rate (ppm):', rate)}
        {renderLine('Base Fee (sats):', base)}
      </>
    );
  };

  return (
    <React.Fragment key={channel.id || ''}>
      <SubCard>
        <Clickable onClick={() => openSet(open ? 0 : index)}>
          <ResponsiveLine>
            {channel?.partner?.node?.alias}
            <ScoreLine>{renderContent()}</ScoreLine>
          </ResponsiveLine>
        </Clickable>
        {open && renderDetails()}
      </SubCard>
    </React.Fragment>
  );
};

export const FeeStats = () => {
  const [open, openSet] = React.useState(0);
  const [openTwo, openTwoSet] = React.useState(0);
  const dispatch = useStatsDispatch();
  const { auth } = useAccountState();
  const { data, loading } = useGetFeeHealthQuery({
    skip: !auth,
    variables: { auth },
  });

  React.useEffect(() => {
    if (data && data.getFeeHealth) {
      dispatch({
        type: 'change',
        state: { feeScore: data.getFeeHealth.score },
      });
    }
  }, [data, dispatch]);

  if (loading || !data?.getFeeHealth?.channels?.length) {
    return null;
  }

  const sortedArray = sortBy(
    data.getFeeHealth.channels,
    c => c?.partnerSide?.score
  );
  const sortedArrayMyStats = sortBy(
    data.getFeeHealth.channels,
    c => c?.mySide?.score
  );

  return (
    <>
      <StatWrapper title={'Fee Stats'}>
        {sortedArray.map((channel, index) => (
          <FeeStatCard
            key={channel?.id || ''}
            channel={channel as ChannelFeeHealth}
            open={index + 1 === open}
            openSet={openSet}
            index={index + 1}
          />
        ))}
      </StatWrapper>
      <StatWrapper title={'My Fee Stats'}>
        {sortedArrayMyStats.map((channel, index) => (
          <FeeStatCard
            key={channel?.id || ''}
            channel={channel as ChannelFeeHealth}
            myStats={true}
            open={index + 1 === openTwo}
            openSet={openTwoSet}
            index={index + 1}
          />
        ))}
      </StatWrapper>
    </>
  );
};
