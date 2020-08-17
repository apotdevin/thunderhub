import * as React from 'react';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import {
  SubCard,
  DarkSubTitle,
  SingleLine,
} from 'src/components/generic/Styled';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { Plus, Minus } from 'react-feather';
import { useGetChannelsQuery } from 'src/graphql/queries/__generated__/getChannels.generated';
import { themeColors, chartColors } from 'src/styles/Themes';
import { RebalanceIdType } from '../AdvancedBalance';

type ModalChannelsType = {
  channels?: RebalanceIdType[];
  ignore?: string;
  callback?: (channel: RebalanceIdType) => void;
};

export const ModalChannels: React.FC<ModalChannelsType> = ({
  channels,
  ignore,
  callback,
}) => {
  const { loading, data } = useGetChannelsQuery();

  if (loading || !data || !data.getChannels) {
    return <LoadingCard noCard={true} />;
  }

  const allChannels = data.getChannels.map(p => ({
    alias: p?.partner_node_info.node.alias || '',
    id: p?.id || '',
    publicKey: p?.partner_public_key || '',
  }));

  return (
    <>
      {allChannels
        .filter(c => c.id !== ignore)
        .map(channel => {
          const isSelected =
            channels && !!channels.find(n => n.id === channel.id);
          return (
            <SubCard
              key={channel.id}
              color={isSelected ? themeColors.blue2 : undefined}
            >
              <SingleLine>
                <div>
                  {channel.alias}
                  <DarkSubTitle>{channel.id}</DarkSubTitle>
                </div>
                <ColorButton
                  color={isSelected ? chartColors.red : undefined}
                  onClick={() => {
                    callback &&
                      callback({
                        alias: channel.alias,
                        id: channel.publicKey,
                      });
                  }}
                >
                  {isSelected ? <Minus size={18} /> : <Plus size={18} />}
                </ColorButton>
              </SingleLine>
            </SubCard>
          );
        })}
    </>
  );
};
