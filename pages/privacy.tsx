import React from 'react';
import { Section } from '../src/components/section/Section';
import { themeColors, fontColors } from '../src/styles/Themes';
import {
  Title,
  Question,
  Text,
  BulletPoint,
} from '../src/components/typography/Styled';
import { ContactSection } from '../src/views/homepage/Sections/ContactSection';

import { Link } from '../src/components/link/Link';

const PrivacyView = () => {
  const props = { color: fontColors.blue2, underline: fontColors.blue2 };

  const renderLinks = (terms: string, privacy: string) => (
    <>
      <Link href={terms} {...props}>
        Privacy Policy
      </Link>{' '}
      and{' '}
      <Link href={privacy} {...props}>
        Terms of Service
      </Link>
    </>
  );

  return (
    <>
      <Section color={themeColors.blue3} padding={'40px 0'}>
        <Title>Privacy Policy</Title>
      </Section>
      <Section color={themeColors.grey} padding={'60px 0 16px'}>
        <Text>Last Updated: February 12, 2020</Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Text>
          ThunderHub takes your privacy very seriously, and as a general rule,
          will never collect unnecessary data from you without your explicit
          consent. However, through using it, you will end up providing us with
          some sensitive information, so we want to be explicit about that.
        </Text>
        <Text>
          This Privacy Policy describes our policies and procedures regarding
          our collection and use of your information in connection with your
          access and use of{' '}
          <Link to={'/'} {...props}>
            https://thunderhub.io
          </Link>{' '}
          (the "Site"). By using this service, you acknowledge and agree to this
          Privacy Policy.
        </Text>
        <Text>
          The terms "us," "we," or "our" refer to ThunderHub. The terms "you",
          "your", or "user" refer to those accessing our site.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>Collection, Storage, and Use of Information</Question>
        <Text>
          ThunderHub's site is designed to collect as little information as
          possible. The following outlines what is (and is not) collected, and
          how it's handled. What we do collect from users is stored either
          locally on the user's device, or using browser storage APIs that keep
          inaccessible to us without user action. Sensitive information such as
          authentication credentials are AES-256 encrypted and stored using a
          password known only to the user.
        </Text>
        <Text>
          <b>Node Credentials</b> - In order to communicate with your Lightning
          node, we ask for sensitive information to do so. This information is
          stored using your browser's own storage APIs, and is encrypted using a
          password only known to the user. This information is used by the
          server to connect to your node but is never recorded outside of the
          user's browser storage.
        </Text>
        <Text>
          <b>Error Reporting / Usage Statistics</b> - No information is
          recorded. If information must be recorded further on, it will be with
          explicit user consent from the user and efforts will be taken to keep
          the information anonymous and private.
        </Text>
        <Text>
          <b>Personal information</b> - Information such as your name, IP
          address, email address, or browsing activity are never collected
          without explicit consent. While there is no plan to ever ask for
          permission to passively collect it, some interactions such as support
          requests or bug reports may optionally ask for it.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>Third Parties</Question>
        <Text>
          The following is a list of third parties who may obtain user
          information through use of the Site and App, as well as links to their
          respective privacy policies. While we aim to only leverage third
          parties that we find to be privacy-friendly, and try to keep them as
          opt-in as possible, we are not liable for any privacy violations as a
          result of the user's interaction with third party services. Any
          services found to be exploiting our user's information will be removed
          as quickly as possible.
        </Text>
        <Text>
          <b>Hosting</b> - The following services are used for the hosting and
          distrubtion of our site and application. Your information is subject
          to their policies when interacting with them.
        </Text>
        <BulletPoint>
          <b>Github</b> - Github's{' '}
          {renderLinks(
            'https://help.github.com/en/articles/github-privacy-statement',
            'https://help.github.com/en/articles/github-terms-of-service'
          )}
        </BulletPoint>
        <BulletPoint>
          <b>AWS</b> - AWS's{' '}
          {renderLinks(
            'https://aws.amazon.com/privacy/',
            'https://aws.amazon.com/service-terms/'
          )}
        </BulletPoint>
        <Text>
          <b>APIs</b> - For information that your node can't get alone, we link
          to or use APIs in our application that leverage the following
          services. Your information is subject to their policies when
          interacting with them.
        </Text>
        <BulletPoint>
          <b>Earn.com's Bitcoin Fee API</b> - Earn.com's{' '}
          {renderLinks(
            'https://earn.com/privacy/',
            'https://earn.com/terms-of-use/'
          )}
        </BulletPoint>
        <BulletPoint>
          <b>Blockchain Explorer and Price API</b> - Blockchain's{' '}
          {renderLinks(
            'https://www.blockchain.com/legal/privacy',
            'https://www.blockchain.com/legal/terms'
          )}
        </BulletPoint>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>Law Enforcement Purposes</Question>
        <Text>
          If required by a subpoena or court order, we will share information to
          law enforcement agencies in order to comply with legal requirements.
          We will make reasonable efforts to notify any subjects of such
          informational disclosure as is permitted by law.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 60px'}>
        <Question>Amendments</Question>
        <Text>
          We may alter this Privacy Policy at its discretion at any time for any
          or no reason. Any changes will include a corresponding “Last updated”
          date shown at the top of this page and such changes will go in effect
          immediately. Prominent notice of any changes may be posted on our
          site, in our application, or on social media. Such notice is not
          guaranteed and you should check for updates regularly. The latest
          version of the Privacy Policy will be considered as superseding any
          previous version unless otherwise noted.
        </Text>
      </Section>
      <ContactSection />
    </>
  );
};

export default PrivacyView;
