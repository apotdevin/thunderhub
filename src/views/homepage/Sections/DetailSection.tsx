import React from 'react';
import {
  Card,
  SubTitle,
  ColumnLine,
  Sub4Title,
  SingleLine,
} from '../../../components/generic/Styled';
import styled from 'styled-components';
import {
  Eye,
  Send,
  Key,
  Server,
  Sliders,
  Users,
} from '../../../components/generic/Icons';
import { cardColor, mediaWidths } from '../../../styles/Themes';
import { Section } from '../../../components/section/Section';

const Padding = styled.div`
  padding: ${({ padding }: { padding?: string }) =>
    padding ? padding : '16px'};
`;

const DetailCard = styled(Card)`
  background-color: ${cardColor};
  margin-bottom: 0;
  margin: 8px 16px;
  z-index: 1;
  flex: 1 0 30%;

  @media (${mediaWidths.mobile}) {
    flex: 1 0 100%;
  }
`;

const DetailLine = styled.div`
  margin: 0 -16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  @media (${mediaWidths.mobile}) {
    margin: 0;
  }
`;

const detailCardContent = (title: string, text: string, Icon: any) => (
  <DetailCard>
    <SingleLine>
      <Padding>
        <Icon size={'40px'} strokeWidth={'1px'} />
      </Padding>
      <ColumnLine>
        <SubTitle fontWeight={'900'}>{title}</SubTitle>
        <Sub4Title>{text}</Sub4Title>
      </ColumnLine>
    </SingleLine>
  </DetailCard>
);

export const DetailSection = () => {
  return (
    <Section padding={'0 0 48px'} withColor={false}>
      <DetailLine>
        {detailCardContent(
          'Make Payments',
          'Send and receive both Lightning and On-Chain payments.',
          Send
        )}
        {detailCardContent(
          'Multiple Nodes',
          'Connect to multiple nodes and quickly switch between them.',
          Server
        )}
        {detailCardContent(
          'View-Only Mode',
          'Check the status of your node any time without risk.',
          Eye
        )}
        {detailCardContent(
          'AES Encryption',
          'Your Macaroon is AES encrypted with a password only you know.',
          Key
        )}
        {detailCardContent(
          'Open Source',
          "Don't trust anyone. Verify the code yourself.",
          Users
        )}
        {detailCardContent(
          'Manage Channels',
          'Open, close and monitor channel status and liquidity',
          Sliders
        )}
      </DetailLine>
    </Section>
  );
};
