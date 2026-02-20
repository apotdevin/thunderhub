import { inverseTextColor } from '../../styles/Themes';
import { Section } from '../../components/section/Section';
import { Headline, HomeTitle, HomeText, FullWidth } from './HomePage.styled';

export const TopSection = () => (
  <Section color={'transparent'} textColor={inverseTextColor}>
    <Headline>
      <HomeTitle>Control the Lightning</HomeTitle>
      <FullWidth>
        <HomeText>
          Monitor and manage your node from any browser and any device.
        </HomeText>
      </FullWidth>
    </Headline>
  </Section>
);
