import React from 'react';
import { Section } from 'components/section/Section';
import { themeColors, fontColors } from 'styles/Themes';
import { Send, GithubIcon, MailIcon } from 'components/generic/Icons';
import {
    Center,
    Question,
    SectionTitle,
    DetailCard,
    DetailLine,
    SmallText,
    IconMargin,
    IconTitle,
} from './OtherViews.styled';

export const ContactSection = () => (
    <Section color={themeColors.grey3} padding={'24px 0 80px'}>
        <Center>
            <SectionTitle textColor={fontColors.blue3}>
                Need to contact us?
            </SectionTitle>
        </Center>
        <DetailLine>
            <DetailCard>
                <Question>
                    <IconTitle>
                        <IconMargin>
                            <Send size={'24px'} />
                        </IconMargin>
                        Telegram
                    </IconTitle>
                </Question>
                <SmallText>
                    Write to me on Telegram @apotdevin. I usually answer quick.
                </SmallText>
            </DetailCard>
            <DetailCard>
                <Question>
                    <IconTitle>
                        <IconMargin>
                            <GithubIcon size={'24px'} />
                        </IconMargin>
                        Github
                    </IconTitle>
                </Question>
                <SmallText>
                    See the code, open issues or contribute on github.
                </SmallText>
            </DetailCard>
            <DetailCard>
                <Question>
                    <IconTitle>
                        <IconMargin>
                            <MailIcon size={'24px'} />
                        </IconMargin>
                        Email
                    </IconTitle>
                </Question>
                <SmallText>
                    Write us an email at thunderhub@protonmail.com
                </SmallText>
            </DetailCard>
        </DetailLine>
    </Section>
);
