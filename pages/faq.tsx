import React from 'react';
import { Section } from '../src/components/section/Section';
import { themeColors } from '../src/styles/Themes';
import {
  Title,
  Center,
  Subtitle,
  Question,
  Text,
} from '../src/components/typography/Styled';
import { ContactSection } from '../src/views/homepage/Sections/ContactSection';
import styled from 'styled-components';

const FaqTitle = styled(Title)`
  margin-bottom: 0px;
`;

const FaqView = () => {
  return (
    <>
      <Section color={themeColors.blue3} padding={'40px 0 48px'}>
        <FaqTitle>FAQ: Answers to Common Questions</FaqTitle>
        <Center>
          <Subtitle>
            Learn about ThunderHub by reading these frequently asked questions.
          </Subtitle>
        </Center>
      </Section>
      <Section color={themeColors.grey} padding={'60px 0 16px'}>
        <Question>What is ThunderHub?</Question>
        <Text>
          ThunderHub is a <b>LND node manager</b> that you can open in any
          browser and on any device.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>How much does it cost?</Question>
        <Text>
          <b>No cost</b>, ThunderHub is open-source so no need to spend any
          precious sats here.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>What is the value of ThunderHub?</Question>
        <Text>
          ThunderHub brings a <b>full lightning node manager </b>
          directly to your device without the need of installing plugins,
          extensions or apps, having specific browsers or operating systems and
          is completely <b>open-source.</b>
        </Text>
        <Text>
          ThunderHub provides a <b>simple and easy to use </b>manager without
          needing to give us any private information. Everything is stored
          directly in your browser and sensitive information (like your admin
          macaroon) are AES-256 encrypted with a password only you know.
        </Text>
        <Text>
          <b>The code is public and available for anyone to audit.</b>
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>Is ThunderHub safe to use?</Question>
        <Text>
          ThunderHub is open-source and available for anyone to audit.
          <b>
            This still doesn't mean it's completely bullet proof against
            attackers.
          </b>
        </Text>
        <Text>
          If you connect using your admin macaroon, it is
          <b> AES-256 encrypted, password protected</b> and
          <b> stored only in your browser. </b>
          The password is only known by you and you need to unlock your account
          everytime you want to perform an admin only change such as managing
          channels or sending and receiving bitcoin or lightning payments.
        </Text>
        <Text>
          The ThunderHub server uses your credentials to connect to your node
          but they are never stored outside of your browser. Still, this
          involves a certain degree of trust you must be aware of.
        </Text>
        <Text>
          If you want a more secure alternative, you can connect using a
          view-only macaroon and use ThunderHub only for monitoring your node.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>What happens if I forget my password?</Question>
        <Text>
          The password is only known by you and is used to unlock an encrypted
          macaroon stored only on your browser making it impossible for us to
          help you with this situation.
        </Text>
        <Text>
          The fix is simple. <b>Delete that account on ThunderHub </b>
          (Don't worry, this doesn't delete anything or affect in any way your
          node) <b>and connect again </b>with your desired macaroons.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>Am I being tracked in anyway?</Question>
        <Text>
          <b>We do not track anything from our users </b>and
          <b> store no information on our servers. </b>
          Should it be needed in the future, we will notify users and ask for
          explicit consent before hand.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 60px'}>
        <Question>
          Can I use ThunderHub without having my own Lightning Node?
        </Question>
        <Text>
          ThunderHub provides full lightning node management which is only
          possible when you are the owner of the lightning node to which it is
          connecting. So in short,
          <b> no </b> you cannot use ThunderHub without having your own node.
        </Text>
        <Text>
          Nowadays with the posibility of using pruned bitcoin nodes (Bitcoin
          nodes which only have a section of the Bitcoin blockchain), you can
          get a lightning node up and running in the cloud{' '}
          <b>for under €15/month.</b>
        </Text>
      </Section>
      <ContactSection />
    </>
  );
};

export default FaqView;
