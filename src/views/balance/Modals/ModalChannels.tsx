import * as React from 'react';
import { useAccountState } from 'src/context/AccountContext';
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
import { RebalanceIdType, ActionType } from '../AdvancedBalance';

type ModalChannelsType = {
  multi?: boolean;
  channels?: RebalanceIdType[];
  ignore?: string;
  openSet?: () => void;
  dispatch?: (action: ActionType) => void;
  callback?: (channel: RebalanceIdType) => void;
};

export const ModalChannels: React.FC<ModalChannelsType> = ({
  multi,
  channels,
  ignore,
  openSet,
  dispatch,
  callback,
}) => {
  const { auth } = useAccountState();

  const { loading, data } = useGetChannelsQuery({
    skip: !auth,
    variables: { auth },
  });

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
                    if (multi) {
                      if (isSelected) {
                        dispatch &&
                          dispatch({
                            type: 'removeChannel',
                            id: channel.id,
                          });
                      } else {
                        dispatch &&
                          dispatch({
                            type: 'addChannel',
                            channel: {
                              alias: channel.alias,
                              id: channel.id,
                            },
                          });
                      }
                    } else {
                      callback &&
                        callback({
                          alias: channel.alias,
                          id: channel.publicKey,
                        });
                    }
                  }}
                >
                  {isSelected ? <Minus size={18} /> : <Plus size={18} />}
                </ColorButton>
              </SingleLine>
            </SubCard>
          );
        })}
      {multi && (
        <ColorButton onClick={openSet} fullWidth={true} withMargin={'16px 0 0'}>
          Done
        </ColorButton>
      )}
    </>
  );
};
