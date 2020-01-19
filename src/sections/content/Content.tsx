import React from 'react';
import styled from 'styled-components';
import { Navigation } from '../../sections/navigation/Navigation';
import { Wrapper } from '../../components/generic/Styled';
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

const Container = styled.div`
    display: grid;
    grid-template-areas: 'nav content content';
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    gap: 16px;
`;

const ContentStyle = styled.div`
    grid-area: content;
`;

const Content = () => {
    return (
        <Wrapper>
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
        </Wrapper>
    );
};

const getGrid = (Content: any) => (
    <Container>
        <Navigation />
        <ContentStyle>
            <Content />
        </ContentStyle>
    </Container>
);

export default Content;
