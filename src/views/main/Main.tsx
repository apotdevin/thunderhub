import React from 'react';
import styled from 'styled-components';
import { Header } from '../../sections/header/Header';
import { Footer } from '../../sections/footer/Footer';
import { Navigation } from '../../sections/navigation/Navigation';
import { Content } from '../../sections/content/Content';

const Container = styled.div`
    display: grid;
    grid-template-areas:
        'header header header'
        'nav content content'
        'footer footer footer';
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    gap: 10px;
    height: 100vh;
`;

const MainView = () => (
    <Container>
        <Header />
        <Navigation />
        <Content />
        <Footer />
    </Container>
);

export default MainView;
