import React from 'react';
import { Section } from 'components/section/Section';
import { themeColors } from 'styles/Themes';
import { Title, Question, Text } from '../OtherViews.styled';
import { ContactSection } from '../ContactSection';

export const PrivacyView = () => {
    return (
        <>
            <Section color={themeColors.blue3} padding={'40px 0 64px'}>
                <Title>Privacy Policy</Title>
            </Section>
            <Section color={themeColors.grey} padding={'60px 0 16px'}>
                <Text>Last Updated: January 28, 2020</Text>
            </Section>
            <Section color={themeColors.grey} padding={'19px 0 16px'}>
                <Text>
                    ThunderHub takes your privacy very seriously, and as a
                    general rule, will never collect unnecessary data from you
                    without your explicit consent. However, through using it,
                    you will end up providing us with some sensitive
                    information, so we want to be explicit about that.
                </Text>
                <Text>
                    This Privacy Policy describes our policies and procedures
                    regarding our collection and use of your information in
                    connection with your access and use of
                    https://thunderhub.io/ (the "Site"). By using this service,
                    you acknowledge and agree to this Privacy Policy.
                </Text>
                <Text>
                    The terms "us," "we," or "our" refer to ThunderHub. The
                    terms "you", "your", or "user" refer to those accessing our
                    site.
                </Text>
            </Section>
            <Section color={themeColors.grey} padding={'19px 0 16px'}>
                <Question>Collection, Storage, and Use of Information</Question>
                <Text>
                    ThunderHub's site and application are designed to collect as
                    little information as possible. The following outlines what
                    is (and is not) collected, and how it's handled. What we do
                    collect from users is stored either locally on the user's
                    device, or using browser storage APIs that keep inaccessible
                    to us without user action. Sensitive information such as
                    authentication credentials are AES-256 encrypted and stored
                    using a password known only to the user.
                </Text>
            </Section>
            <Section color={themeColors.grey} padding={'19px 0 16px'}>
                <Question>Law Enforcement Purposes</Question>
                <Text>
                    If required by a subpoena or court order, we will share
                    information to law enforcement agencies in order to comply
                    with legal requirements. We will make reasonable efforts to
                    notify any subjects of such informational disclosure as is
                    permitted by law.
                </Text>
            </Section>
            <Section color={themeColors.grey} padding={'19px 0 60px'}>
                <Question>Amendments</Question>
                <Text>
                    We may alter this Privacy Policy at its discretion at any
                    time for any or no reason. Any changes will include a
                    corresponding “Last updated” date shown at the top of this
                    page and such changes will go in effect immediately.
                    Prominent notice of any changes may be posted on our site,
                    in our application, or on social media. Such notice is not
                    guaranteed and you should check for updates regularly. The
                    latest version of the Privacy Policy will be considered as
                    superseding any previous version unless otherwise noted.
                </Text>
            </Section>
            <ContactSection />
        </>
    );
};
