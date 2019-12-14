import React from 'react';
import styled from 'styled-components';
import { Navigation } from '../../sections/navigation/Navigation';
import { Content } from '../../sections/content/Content';

const Container = styled.div`
    display: grid;
    grid-template-areas: 'nav content content';
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    gap: 10px;
`;

const MainView = () => (
    <Container>
        <Navigation />
        <Content />
    </Container>
);

export default MainView;
