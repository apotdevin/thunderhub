import React from 'react';
import styled from 'styled-components';
import { Navigation } from '../../sections/navigation/Navigation';
import { Switch, Route } from 'react-router';

import { Home } from '../../views/home/Home';
import { NotFound } from '../../views/notFound/NotFound';
import { ChannelView } from '../../views/channels/ChannelView';
import { SettingsView } from '../../views/settings/Settings';
import { TransactionList } from '../../views/transactions/TransactionList';
import { FeesView } from '../../views/fees/Fees';
import { ForwardsList } from '../../views/forwards/ForwardList';
import { TermsView } from '../../views/other/terms/TermsView';
import { PrivacyView } from '../../views/other/privacy/PrivacyView';
import { FaqView } from '../../views/other/faq/FaqView';
import { Section } from 'components/section/Section';
import { BitcoinPrice } from '../../components/bitcoinInfo/BitcoinPrice';
import { BitcoinFees } from '../../components/bitcoinInfo/BitcoinFees';
import { mediaWidths } from 'styles/Themes';
import { useConnectionState } from 'context/ConnectionContext';
import { LoadingView, ErrorView } from 'views/stateViews/StateCards';
import { BalanceView } from 'views/balance/Balance';
import { PeersList } from 'views/peers/PeersList';
import { ToolsView } from 'views/tools';
import { ChainView } from 'views/chain/ChainView';

const Container = styled.div`
    display: grid;
    grid-template-areas: 'nav content content';
    grid-template-columns: auto 1fr 200px;
    gap: 16px;

    @media (${mediaWidths.mobile}) {
        display: flex;
        flex-direction: column;
    }
`;

const ContentStyle = styled.div`
    grid-area: content;
`;

const Content = () => {
    const { loading, error } = useConnectionState();

    const renderSettings = (type: string) => (
        <Switch>
            <Route path="/settings" render={() => getGrid(SettingsView)} />
            <Route
                path="*"
                render={() =>
                    getGrid(type === 'error' ? ErrorView : LoadingView)
                }
            />
        </Switch>
    );

    if (loading) return renderSettings('loading');
    if (error) return renderSettings('error');

    return (
        <>
            <BitcoinPrice />
            <BitcoinFees />
            <Switch>
                <Route exact path="/" render={() => getGrid(Home)} />
                <Route path="/peers" render={() => getGrid(PeersList)} />
                <Route path="/channels" render={() => getGrid(ChannelView)} />
                <Route path="/balance" render={() => getGrid(BalanceView)} />
                <Route path="/tools" render={() => getGrid(ToolsView)} />
                <Route
                    path="/transactions"
                    render={() => getGrid(TransactionList)}
                />
                <Route path="/forwards" render={() => getGrid(ForwardsList)} />
                <Route
                    path="/chaintransactions"
                    render={() => getGrid(ChainView)}
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
