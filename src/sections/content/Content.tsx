import React from 'react';
import styled from 'styled-components';
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

const ContentStyle = styled.div`
    /* display: flex;
	justify-content: center;
	align-items: center; */
    /* padding: 0 10px; */
    /* background-color: blue; */
    grid-area: content;
    margin-right: 0.5rem;
`;

export const Content = () => {
    return (
        <ContentStyle>
            <Switch>
                <Route exact path="/" render={() => <Home />} />
                <Route path="/channels" render={() => <ChannelView />} />
                <Route path="/backups" render={() => <BackupsView />} />
                <Route
                    path="/transactions"
                    render={() => <TransactionList />}
                />
                <Route path="/forwards" render={() => <ForwardsList />} />
                <Route
                    path="/chaintransactions"
                    render={() => <ChainTransactions />}
                />
                <Route path="/settings" render={() => <SettingsView />} />
                <Route path="/fees" render={() => <FeesView />} />
                <Route path="*" render={() => <NotFound />} />
            </Switch>
        </ContentStyle>
    );
};
