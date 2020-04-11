import React from 'react';
import { DetailSection } from './Sections/DetailSection';
import { ContactSection } from './Sections/ContactSection';
import { Compatible } from './Sections/Compatible';
import { InfoSection } from './Sections/InfoSection';
import { CallToAction } from './Sections/CallToAction';
import { TopSection } from './Sections/Top';

export const HomePageView = () => {
  return (
    <>
      <TopSection />
      <DetailSection />
      <Compatible />
      <InfoSection />
      <CallToAction />
      <ContactSection />
    </>
  );
};
