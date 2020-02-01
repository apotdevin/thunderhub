import React from 'react';
import styled from 'styled-components';
import { Navigation } from '../../sections/navigation/Navigation';
import { Switch, Route } from 'react-router';

import { Home } from '../../views/home/Home';
import { NotFound } from '../../views/notFound/NotFound';
import { ChannelView } from '../../views/channels/ChannelView';
import { SettingsView } from '../../views/settings/Settings';
import { TransactionList } from '../../views/transactions/TransactionList';
import { BackupsView } from '../../views/backups/Backups';
import { FeesView } from '../../views/fees/Fees';
import { ChainTransactions } from '../../views/chain/ChainTransactions';
import { ForwardsList } from '../../views/forwards/ForwardList';
import { TermsView } from '../../views/other/terms/TermsView';
import { PrivacyView } from '../../views/other/privacy/PrivacyView';
import { FaqView } from '../../views/other/faq/FaqView';
import { Section } from 'components/section/Section';
import { BitcoinPrice } from '../../components/bitcoinInfo/BitcoinPrice';
import { BitcoinFees } from '../../components/bitcoinInfo/BitcoinFees';

const Container = styled.div`
    display: grid;
    grid-template-areas: 'nav content content';
    grid-template-columns: auto 1fr 200px;
    gap: 16px;

    @media (max-width: 578px) {
        display: flex;
        flex-direction: column;
    }
`;

const ContentStyle = styled.div`
    grid-area: content;
`;

const Content = () => {
    return (
        <>
            <BitcoinPrice />
            <BitcoinFees />
            <Switch>
                <Route exact path="/" render={() => getGrid(Home)} />
                <Route path="/channels" render={() => getGrid(ChannelView)} />
                <Route path="/backups" render={() => getGrid(BackupsView)} />
                <Route
                    path="/transactions"
                    render={() => getGrid(TransactionList)}
                />
                <Route path="/forwards" render={() => getGrid(ForwardsList)} />
                <Route
                    path="/chaintransactions"
                    render={() => getGrid(ChainTransactions)}
                />
                <Route path="/settings" render={() => getGrid(SettingsView)} />
                <Route path="/fees" render={() => getGrid(FeesView)} />
                <Route path="/terms" render={() => <TermsView />} />
                <Route path="/privacy" render={() => <PrivacyView />} />
                <Route path="/faq" render={() => <FaqView />} />
                <Route path="*" render={() => <NotFound />} />
            </Switch>
        </>
    );
};

const getGrid = (Content: any) => (
    <Section padding={'16px 0 32px'}>
        <Container>
            <Navigation />
            <ContentStyle>
                <Content />
            </ContentStyle>
        </Container>
    </Section>
);

export default Content;
