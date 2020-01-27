import React from 'react';
import styled from 'styled-components';
import { Wrapper } from '../../components/generic/Styled';
import { Link } from 'react-router-dom';
import { headerColor, headerTextColor } from 'styles/Themes';

const FooterStyle = styled.div`
    margin-top: 80px;
    padding: 40px 0;
    height: 300px;
    color: ${headerTextColor};
`;

export const Footer = () => {
    return (
        <Wrapper withColor={true} color={headerColor}>
            <FooterStyle>
                ThunderHub
                <Link to={'/faq'}>FAQ</Link>
                <Link to={'/terms'}>Terms of Use</Link>
                <Link to={'/privacy'}>Privacy Policy</Link>
            </FooterStyle>
        </Wrapper>
    );
};
