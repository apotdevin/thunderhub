import * as React from 'react';
import { HelpCircle } from 'react-feather';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import {
  useAccountState,
  CLIENT_ACCOUNT,
  AccountType,
} from 'src/context/AccountContext';
import { CardWithTitle, SubTitle } from '../generic/Styled';
import { useConfigState } from '../../context/ConfigContext';
import {
  ArrowLeft,
  ArrowRight,
  StyledNodeBar,
  NodeBarContainer,
} from './NodeInfo.styled';
import { NodeCard } from './NodeCard';

const StyledQuestion = styled(HelpCircle)`
  margin-left: 8px;
`;

export const NodeBar = () => {
  const { accounts } = useAccountState();
  const { multiNodeInfo } = useConfigState();
  const slider = React.useRef<HTMLDivElement>(null);

  const viewOnlyAccounts = accounts.filter(
    account => account.type === CLIENT_ACCOUNT && account.viewOnly !== ''
  ) as AccountType[];

  const handleScroll = (decrease?: boolean) => {
    if (slider.current !== null) {
      if (decrease) {
        slider.current.scrollLeft -= 240;
      } else {
        slider.current.scrollLeft += 240;
      }
    }
  };

  if (viewOnlyAccounts.length <= 1 || !multiNodeInfo) {
    return null;
  }

  return (
    <CardWithTitle>
      <SubTitle>
        Your Nodes
        <span data-tip data-for="node_info_question">
          <StyledQuestion size={14} />
        </span>
      </SubTitle>
      <NodeBarContainer>
        <div
          role={'button'}
          onClick={() => {
            handleScroll(true);
          }}
          onKeyDown={() => {
            handleScroll(true);
          }}
          tabIndex={0}
        >
          <ArrowLeft size={18} />
        </div>
        <div
          role={'button'}
          onClick={() => {
            handleScroll();
          }}
          onKeyDown={() => {
            handleScroll();
          }}
          tabIndex={-1}
        >
          <ArrowRight size={18} />
        </div>
        <StyledNodeBar ref={slider}>
          {viewOnlyAccounts.map(account => (
            <React.Fragment key={account.id}>
              <NodeCard account={account} accountId={account.id} />
            </React.Fragment>
          ))}
        </StyledNodeBar>
      </NodeBarContainer>
      <ReactTooltip id={'node_info_question'} effect={'solid'} place={'right'}>
        Only accounts with a view-only macaroon will appear here.
      </ReactTooltip>
    </CardWithTitle>
  );
};
