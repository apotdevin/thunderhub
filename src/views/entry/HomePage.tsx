import React from 'react';
import styled from 'styled-components';
import { ReactComponent as HeadlineImage } from '../../images/MoshingDoodle.svg';
import { Wrapper } from '../../components/generic/Styled';

const Headline = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32px 0;
`;

const LeftHeadline = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
`;

const StyledImage = styled(HeadlineImage)`
    width: 500px;
`;

interface HomePageProps {
    setLogin: (login: boolean) => void;
}

export const HomePageView = ({ setLogin }: HomePageProps) => {
    return (
        <>
            <Wrapper>
                <Headline>
                    <LeftHeadline>
                        <h1>Control The Power of Lighting</h1>
                        <h4>
                            Take full control of your lightning node. Think of
                            something else to place here. Think Think Think
                        </h4>
                        <h5>Available everywhere you can open a website.</h5>
                        <button onClick={() => setLogin(true)}>Login</button>
                    </LeftHeadline>
                    <StyledImage />
                </Headline>
            </Wrapper>
            <Wrapper withColor={true}>
                <div>Hello</div>
            </Wrapper>
            <Wrapper>
                <div>Hello</div>
            </Wrapper>
        </>
    );
};
