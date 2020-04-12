import React from 'react';
import { Section } from '../../../components/section/Section';
import { fontColors, homeBackgroundColor } from '../../../styles/Themes';
import { Send, GithubIcon, MailIcon } from '../../../components/generic/Icons';
import {
  Center,
  Question,
  SectionTitle,
  DetailCard,
  DetailLine,
  SmallText,
  IconMargin,
  IconTitle,
} from '../../../components/typography/Styled';

export const ContactSection = () => (
  <Section color={homeBackgroundColor} padding={'24px 0 80px'}>
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
          Write to me on Telegram @apotdevin. Usually a quick response.
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
        <SmallText>Write us an email at thunderhub@protonmail.com</SmallText>
      </DetailCard>
    </DetailLine>
  </Section>
);
