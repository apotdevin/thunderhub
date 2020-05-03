import React, { useRef } from 'react';
import { useAccount } from '../../context/AccountContext';
import { NodeCard } from './NodeCard';
import { CardWithTitle, SubTitle } from '../generic/Styled';
import {
  ArrowLeft,
  ArrowRight,
  StyledNodeBar,
  NodeBarContainer,
} from './NodeInfo.styled';
import { HelpCircle } from 'react-feather';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { useSettings } from '../../context/SettingsContext';
import { getTooltipType } from '../generic/helpers';

const StyledQuestion = styled(HelpCircle)`
  margin-left: 8px;
`;

export const NodeBar = () => {
  const { accounts } = useAccount();
  const { nodeInfo } = useSettings();
  const slider = useRef<HTMLDivElement>(null);

  const { theme } = useSettings();
  const tooltipType: any = getTooltipType(theme);

  const viewOnlyAccounts = accounts.filter(account => account.viewOnly !== '');

  const handleScroll = (decrease?: boolean) => {
    if (slider.current !== null) {
      if (decrease) {
        slider.current.scrollLeft -= 240;
      } else {
        slider.current.scrollLeft += 240;
      }
    }
  };

  if (viewOnlyAccounts.length <= 1 || !nodeInfo) {
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
          onClick={() => {
            handleScroll(true);
          }}
        >
          <ArrowLeft size={18} />
        </div>
        <div
          onClick={() => {
            handleScroll();
          }}
        >
          <ArrowRight size={18} />
        </div>
        <StyledNodeBar ref={slider}>
          {viewOnlyAccounts.map((account, index) => (
            <div key={account.id}>
              <NodeCard account={account} accountId={account.id} />
            </div>
          ))}
        </StyledNodeBar>
      </NodeBarContainer>
      <ReactTooltip
        id={'node_info_question'}
        effect={'solid'}
        place={'right'}
        type={tooltipType}
      >
        Only accounts with a view-only macaroon will appear here.
      </ReactTooltip>
    </CardWithTitle>
  );
};
