import React from 'react';
import { Section } from 'components/section/Section';
import {
    InfoRow,
    ImageSection,
    ImagePlace,
    TextSection,
} from './Sections.styled';
import { Text } from 'views/other/OtherViews.styled';

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
                        <ImagePlace src={'https://www.placecage.com/500/300'} />
                    </ImageSection>
                </InfoRow>
            </Section>
            <Section padding={'48px 0'}>
                <InfoRow reverse={true}>
                    <ImageSection>
                        <ImagePlace src={'https://www.placecage.com/500/300'} />
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
                <InfoRow>
                    <TextSection>
                        <h2>Forwarded Payments</h2>
                        <Text>
                            Quick glance at the forwarded payments that have
                            been going through your node. See the incoming and
                            outgoing channels being used.
                        </Text>
                    </TextSection>
                    <ImageSection>
                        <ImagePlace src={'https://www.placecage.com/500/300'} />
                    </ImageSection>
                </InfoRow>
            </Section>
            <Section padding={'48px 0'}>
                <InfoRow reverse={true}>
                    <ImageSection>
                        <ImagePlace src={'https://www.placecage.com/500/300'} />
                    </ImageSection>
                    <TextSection>
                        <h2>Channel Management</h2>
                        <Text>
                            See all your channels and get a quick preview of how
                            balanced and active they are. Open new channels or
                            close them.
                        </Text>
                    </TextSection>
                </InfoRow>
            </Section>
            <Section padding={'48px 0'}>
                <InfoRow>
                    <TextSection>
                        <h2>Forward Fees</h2>
                        <Text>
                            Manage the fees charged for using your channels to
                            forward payments. Change them for individual
                            channels or all of them at once.
                        </Text>
                    </TextSection>
                    <ImageSection>
                        <ImagePlace src={'https://www.placecage.com/500/300'} />
                    </ImageSection>
                </InfoRow>
            </Section>
            <Section padding={'48px 0'}>
                <InfoRow reverse={true}>
                    <ImageSection>
                        <ImagePlace src={'https://www.placecage.com/500/300'} />
                    </ImageSection>
                    <TextSection>
                        <h2>Transactions</h2>
                        <Text>
                            See in detail all your transactions. When they were
                            created, confirmed or if they expired.
                        </Text>
                    </TextSection>
                </InfoRow>
            </Section>
            <Section padding={'48px 0'}>
                <InfoRow>
                    <TextSection>
                        <h2>Backups</h2>
                        <Text>
                            Backup your channels, verify the backup and recover
                            channels if needed.
                        </Text>
                    </TextSection>
                    <ImageSection>
                        <ImagePlace src={'https://www.placecage.com/500/300'} />
                    </ImageSection>
                </InfoRow>
            </Section>
            <Section padding={'48px 0 80px'}>
                <InfoRow reverse={true}>
                    <ImageSection>
                        <ImagePlace src={'https://www.placecage.com/500/300'} />
                    </ImageSection>
                    <TextSection>
                        <h2>Night Mode</h2>
                        <Text>
                            Prefer working in the dark? We have an awesome night
                            mode just for your needs.
                        </Text>
                    </TextSection>
                </InfoRow>
            </Section>
        </>
    );
};
