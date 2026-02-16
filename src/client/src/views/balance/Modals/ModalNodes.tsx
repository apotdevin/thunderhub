import * as React from 'react';
import { useGetPeersQuery } from '../../../graphql/queries/__generated__/getPeers.generated';
import { LoadingCard } from '../../../components/loading/LoadingCard';
import {
  SubCard,
  DarkSubTitle,
  SingleLine,
} from '../../../components/generic/Styled';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { Plus, Minus } from 'lucide-react';
import { shorten } from '../../../components/generic/helpers';
import { Input } from '../../../components/input';
import { useGetNodeLazyQuery } from '../../../graphql/queries/__generated__/getNode.generated';
import { useMutationResultWithReset } from '../../../hooks/UseMutationWithReset';
import { toast } from 'react-toastify';
import { themeColors, chartColors } from '../../../styles/Themes';
import { RebalanceIdType, ActionType } from '../AdvancedBalance';

type ModalNodesType = {
  multi?: boolean;
  nodes?: RebalanceIdType[];
  dispatch?: (action: ActionType) => void;
  openSet?: () => void;
  callback?: (node: RebalanceIdType) => void;
};

export const ModalNodes: React.FC<ModalNodesType> = ({
  multi,
  nodes = [],
  dispatch,
  callback,
  openSet,
}) => {
  const [newNode, newNodeSet] = React.useState<string>('');
  const { loading, data } = useGetPeersQuery();

  const [getNode, { data: _data, loading: nodeLoading }] =
    useGetNodeLazyQuery();
  const [nodeData, resetMutationResult] = useMutationResultWithReset(_data);

  React.useEffect(() => {
    if (nodeData && nodeData.getNode.node?.alias) {
      dispatch &&
        dispatch({
          type: 'addNode',
          node: {
            alias: nodeData.getNode.node.alias,
            id: newNode,
          },
        });
      newNodeSet('');
      resetMutationResult();
    } else if (nodeData && !nodeData.getNode.node?.alias) {
      toast.error(`Node ${newNode} not found.`);
      resetMutationResult();
    }
  }, [nodeData, dispatch, newNode, resetMutationResult]);

  if (loading || !data || !data.getPeers) {
    return <LoadingCard noCard={true} />;
  }

  const peers = data.getPeers.map(p => ({
    alias: p?.partner_node_info.node?.alias || '',
    id: p?.public_key || '',
  }));
  const allNodes: RebalanceIdType[] = [
    ...nodes.filter(n => peers.findIndex(p => p.id === n.id) === -1),
    ...peers,
  ];

  return (
    <>
      {allNodes.map(peer => {
        const isSelected = !!nodes.find(n => n.id === peer.id);
        return (
          <SubCard
            key={peer.id}
            color={isSelected ? themeColors.blue2 : undefined}
          >
            <SingleLine>
              <div>
                {peer.alias}
                <DarkSubTitle>{shorten(peer.id)}</DarkSubTitle>
              </div>
              <ColorButton
                color={isSelected ? chartColors.red : undefined}
                onClick={() => {
                  if (multi) {
                    if (isSelected) {
                      dispatch &&
                        dispatch({
                          type: 'removeNode',
                          public_key: peer.id,
                        });
                    } else {
                      dispatch &&
                        dispatch({
                          type: 'addNode',
                          node: {
                            alias: peer.alias,
                            id: peer.id,
                          },
                        });
                    }
                  } else {
                    callback &&
                      callback({
                        alias: peer.alias,
                        id: peer.id,
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
        <>
          <SubCard>
            <SingleLine>
              <Input
                value={newNode}
                withMargin={'0 16px 0 0'}
                placeholder={'public key'}
                onChange={e => newNodeSet(e.target.value)}
              />
              <ColorButton
                disabled={newNode === ''}
                loading={nodeLoading}
                onClick={() => getNode({ variables: { publicKey: newNode } })}
              >
                <Plus size={18} />
              </ColorButton>
            </SingleLine>
          </SubCard>
          <ColorButton
            onClick={openSet}
            fullWidth={true}
            withMargin={'16px 0 0'}
          >
            Done
          </ColorButton>
        </>
      )}
    </>
  );
};
