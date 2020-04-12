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
import { QuestionIcon } from '../generic/Icons';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { useSettings } from '../../context/SettingsContext';
import { getTooltipType } from '../generic/Helpers';

const StyledQuestion = styled(QuestionIcon)`
  margin-left: 8px;
`;

export const NodeBar = () => {
  const { accounts } = useAccount();
  const { nodeInfo } = useSettings();
  const slider = useRef<HTMLDivElement>(null);

  const { theme } = useSettings();
  const tooltipType = getTooltipType(theme);

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
          <StyledQuestion size={'14px'} />
        </span>
      </SubTitle>
      <NodeBarContainer>
        <div
          onClick={() => {
            handleScroll(true);
          }}
        >
          <ArrowLeft />
        </div>
        <div
          onClick={() => {
            handleScroll();
          }}
        >
          <ArrowRight />
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
