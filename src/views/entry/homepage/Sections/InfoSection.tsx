import React from 'react';
import { Section } from 'components/section/Section';
import {
    InfoRow,
    ImageSection,
    ImagePlace,
    TextSection,
} from './Sections.styled';
import { Text } from 'views/other/OtherViews.styled';
import Transactions from '../../../../assets/images/Transactions.png';
import Reports from '../../../../assets/images/Reports.png';
import Forwards from '../../../../assets/images/Forwards.png';
import Channels from '../../../../assets/images/Channels.png';
import NightLight from '../../../../assets/images/NightLight.png';

export const InfoSection = () => {
    return (
        <>
            <Section padding={'80px 0 40px'}>
                <InfoRow>
                    <TextSection>
                        <h2>Send and Receive</h2>
                        <Text>
                            Send and receive both Lightning and Bitcoin payments
                            in a simple and easy to use interface with both
                            basic and advanced features.
                        </Text>
                    </TextSection>
                    <ImageSection>
                        <ImagePlace src={Transactions} />
                    </ImageSection>
                </InfoRow>
            </Section>
            <Section padding={'48px 0'}>
                <InfoRow reverse={true}>
                    <ImageSection>
                        <ImagePlace src={Reports} />
                    </ImageSection>
                    <TextSection>
                        <h2>Transaction Reports</h2>
                        <Text>
                            Have a quick overview of the invoices coming into
                            your node and payments being made. Check both the
                            amount and value of your transactions. See total
                            amount together with confirmed and unconfirmed
                            invoices.
                        </Text>
                    </TextSection>
                </InfoRow>
            </Section>
            <Section padding={'48px 0'}>
                <InfoRow reverse={true}>
                    <TextSection>
                        <h2>Channel Management</h2>
                        <Text>
                            See all your channels and get a quick preview of how
                            balanced and active they are. Open new channels or
                            close them.
                        </Text>
                    </TextSection>
                    <ImageSection>
                        <ImagePlace src={Channels} />
                    </ImageSection>
                </InfoRow>
            </Section>
            <Section padding={'48px 0'}>
                <InfoRow>
                    <ImageSection>
                        <ImagePlace src={Forwards} />
                    </ImageSection>
                    <TextSection>
                        <h2>Forwarded Payments</h2>
                        <Text>
                            Quick glance at the forwarded payments that have
                            been going through your node. See the incoming and
                            outgoing channels being used.
                        </Text>
                    </TextSection>
                </InfoRow>
            </Section>
            <Section padding={'48px 0 80px'}>
                <InfoRow reverse={true}>
                    <TextSection>
                        <h2>Night/Day Mode</h2>
                        <Text>
                            Prefer working in the dark? We have an awesome night
                            mode just for you. Want it more bright? Got you
                            covered as well.
                        </Text>
                    </TextSection>
                    <ImageSection>
                        <ImagePlace src={NightLight} />
                    </ImageSection>
                </InfoRow>
            </Section>
        </>
    );
};
