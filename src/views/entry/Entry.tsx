import React, { useEffect, useState } from 'react';
import { LoginView } from './login/Login';
import { SessionLogin } from './login/SessionLogin';
import { useHistory } from 'react-router';
import { HomePageView } from './HomePage';

interface HomeProps {
    session?: boolean;
}

const EntryView = ({ session }: HomeProps) => {
    const [login, setLogin] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        if (history.location.pathname !== '/') {
            history.push('/');
        }
    }, [history]);

    return session ? (
        <SessionLogin />
    ) : login ? (
        <LoginView />
    ) : (
        <HomePageView setLogin={setLogin} />
    );
};

export default EntryView;
