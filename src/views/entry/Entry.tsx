import React, { useEffect } from 'react';
import { LoginView } from './login/Login';
import { SessionLogin } from './login/SessionLogin';
import { useHistory, Switch, Route, useLocation } from 'react-router';
import { HomePageView } from './HomePage';

interface HomeProps {
    session?: boolean;
}

const EntryView = ({ session }: HomeProps) => {
    const { push } = useHistory();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/' && location.pathname !== '/login') {
            push('/');
        }
    }, [location, push]);

    const getView = () => {
        return session ? <SessionLogin /> : <HomePageView />;
    };

    return (
        <Switch>
            <Route path="/login" render={() => <LoginView />} />
            <Route path="/" render={() => getView()} />
        </Switch>
    );
};

export default EntryView;
