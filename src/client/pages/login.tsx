import * as React from 'react';
import { Spacer } from '../src/components/spacer/Spacer';
import { ThunderStorm } from '../src/views/homepage/HomePage.styled';
import { appendBasePath } from '../src/utils/basePath';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { TopSection } from '../src/views/homepage/Top';
import { Accounts } from '../src/views/homepage/Accounts';

const ContextApp = () => (
  <>
    <ThunderStorm alt={''} src={appendBasePath('/static/thunderstorm.gif')} />
    <TopSection />
    <Accounts />
    <Spacer />
  </>
);

export default ContextApp;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context, true);
}
