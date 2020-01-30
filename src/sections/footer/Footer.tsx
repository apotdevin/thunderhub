import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { headerColor, headerTextColor } from 'styles/Themes';
import { Section } from 'components/section/Section';

const FooterStyle = styled.div`
    padding: 40px 0;
    height: 300px;
    color: ${headerTextColor};
`;

export const Footer = () => {
    return (
        <Section withColor={true} color={headerColor}>
            <FooterStyle>
                ThunderHub
                <Link to={'/faq'}>FAQ</Link>
                <Link to={'/terms'}>Terms of Use</Link>
                <Link to={'/privacy'}>Privacy Policy</Link>
            </FooterStyle>
        </Section>
    );
};
