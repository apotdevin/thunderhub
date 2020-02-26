import React, { useEffect } from 'react';
import { LoginView } from './login/Login';
import { SessionLogin } from './login/SessionLogin';
import { useHistory, Switch, Route, useLocation } from 'react-router';
import { HomePageView } from './homepage/HomePage';
import { TermsView } from 'views/other/terms/TermsView';
import { PrivacyView } from 'views/other/privacy/PrivacyView';
import { FaqView } from 'views/other/faq/FaqView';

interface HomeProps {
    session?: boolean;
}

const allowedSites = ['/', '/login', '/faq', '/terms', '/privacy'];

const EntryView = ({ session }: HomeProps) => {
    const { push } = useHistory();
    const location = useLocation();

    useEffect(() => {
        if (allowedSites.indexOf(location.pathname) < 0) {
            push('/');
        }
    }, [location, push]);

    const getView = () => {
        return session ? <SessionLogin /> : <HomePageView />;
    };

    return (
        <Switch>
            <Route path="/login" render={() => <LoginView />} />
            <Route path="/terms" render={() => <TermsView />} />
            <Route path="/privacy" render={() => <PrivacyView />} />
            <Route path="/faq" render={() => <FaqView />} />
            <Route path="/" render={() => getView()} />
        </Switch>
    );
};

export default EntryView;
