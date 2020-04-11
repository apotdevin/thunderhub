import React from 'react';
import { Section } from '../src/components/section/Section';
import { themeColors, fontColors } from '../src/styles/Themes';
import { Title, Question, Text } from '../src/components/typography/Styled';
import { ContactSection } from '../src/views/homepage/Sections/ContactSection';
import { Link } from '../src/components/link/Link';

const TermsView = () => {
  const props = { color: fontColors.blue2, underline: fontColors.blue2 };

  return (
    <>
      <Section color={themeColors.blue3} padding={'40px 0'}>
        <Title>Terms of Service</Title>
      </Section>
      <Section color={themeColors.grey} padding={'60px 0 16px'}>
        <Text>Last Updated: January 28, 2020</Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>1. Terms</Question>
        <Text>
          ThunderHub ("us", "we", or "our") provides the website{' '}
          <Link to={'/'} {...props}>
            https://thunderhub.io
          </Link>{' '}
          (the "Site"). Your use of or access to the site is subject to the
          following Terms of Service (the "Agreement").
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>2. Disclaimer</Question>
        <Text>
          We are not responsible for any loss. LND, the ThunderHub website, and
          some of the underlying Javascript libraries we use are under active
          development. While every release is tested, there is always the
          possibility something unexpected happens that causes your funds to be
          lost. Please do not invest more than you are willing to lose. Please
          be careful.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>3. Limitations</Question>
        <Text>
          In no event shall ThunderHub be liable for any damages (including,
          without limitation, damages for loss of data or profit, or due to
          business interruption) arising out of the use or inability to use the
          materials on our website, even if we or an authorized representative
          of ours has been notified orally or in writing of the possibility of
          such damage. Because some jurisdictions do not allow limitations on
          implied warranties, or limitations of liability for consequential or
          incidental damages, these limitations may not apply to you.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>4. Accuracy of Materials</Question>
        <Text>
          The materials appearing on our website could include technical,
          typographical, or photographic errors. We do not warrant that any of
          the material on the website is accurate, complete or current. We may
          make changes to the material contained on the website at any time
          without notice. However we do not make any commitment to update the
          material.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 16px'}>
        <Question>5. Modifications</Question>
        <Text>
          We may revise these terms of service for the website at any time
          without notice. By using this website you are agreeing to be bound by
          the then current version of these terms of service.
        </Text>
      </Section>
      <Section color={themeColors.grey} padding={'19px 0 80px'}>
        <Question>6. Privacy Policy</Question>
        <Text>
          Our Privacy Policy describes the way we do and do not collect, use,
          store, and disclose your personal information, and is hereby
          incorporated by this reference into these Terms. You agree to the
          collection, use, storage, and disclosure of your data in accordance
          with our{' '}
          <Link to={'/privacy'} {...props}>
            Privacy Policy
          </Link>
          .
        </Text>
      </Section>
      <ContactSection />
    </>
  );
};

export default TermsView;
