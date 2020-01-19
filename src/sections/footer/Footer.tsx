import React from 'react';
import styled from 'styled-components';
import { Wrapper } from '../../components/generic/Styled';
import { Link } from 'react-router-dom';

const FooterStyle = styled.div`
    padding: 30px 0;
    height: 300px;
`;

export const Footer = () => {
    return (
        <Wrapper withColor={true}>
            <FooterStyle>
                ThunderHub
                <Link to={'/faq'}>FAQ</Link>
                <Link to={'/terms'}>Terms of Use</Link>
                <Link to={'/privacy'}>Privacy Policy</Link>
            </FooterStyle>
        </Wrapper>
    );
};
