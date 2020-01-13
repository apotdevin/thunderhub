import React from 'react';
import styled from 'styled-components';
import { Navigation } from '../../sections/navigation/Navigation';
import { Content } from '../../sections/content/Content';
import { Wrapper } from '../../components/generic/Styled';

const Container = styled.div`
    display: grid;
    grid-template-areas: 'nav content content';
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    gap: 10px;
`;

const MainView = () => (
    <Wrapper>
        <Container>
            <Navigation />
            <Content />
        </Container>
    </Wrapper>
);

export default MainView;
