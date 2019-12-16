import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LoginView } from '../login/Login';
import { SessionLogin } from '../login/SessionLogin';
import { useHistory } from 'react-router';
import { HomePageView } from './HomePage';

const Login = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
`;

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

    return (
        <Login>
            <h1>Welcome to ThunderHub</h1>
            <h2>This is the entry page</h2>
            {session ? (
                <SessionLogin />
            ) : login ? (
                <LoginView />
            ) : (
                <HomePageView setLogin={setLogin} />
            )}
        </Login>
    );
};

export default EntryView;
