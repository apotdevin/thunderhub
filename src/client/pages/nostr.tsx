import * as React from 'react';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { ChatInit } from '../src/components/chat/ChatInit';
import { ChatFetcher } from '../src/components/chat/ChatFetcher';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { CardWithTitle } from '../src/components/generic/Styled';
import { Settings } from '../src/views/nostr/profile/Settings';
import { Profile } from '../src/views/nostr/profile/Profile';
import { Feed } from '../src/views/nostr/feed/Feed';
import { Follow } from '../src/views/nostr/follow/Follow';

const ChatView = () => {
  return (
    <CardWithTitle>
      <Profile />
      <Settings />
      <Follow />
      <Feed />
    </CardWithTitle>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <ChatInit />
    <ChatFetcher />
    <ChatView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
