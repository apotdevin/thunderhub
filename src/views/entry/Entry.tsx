import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LoginView } from '../login/Login';
import { SessionLogin } from '../login/SessionLogin';
import { useHistory } from 'react-router';
import { HomePageView } from './HomePage';
import { ReactComponent as HeadlineImage } from '../../images/MoshingDoodle.svg';

const Login = styled.div`
    width: 100%;
    max-width: 1000px;
    margin: 0 auto 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32px 0;
`;

const LeftHeadline = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
`;

const StyledImage = styled(HeadlineImage)`
    width: 500px;
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
            <LeftHeadline>
                <h1>Control The Power of Lighting</h1>
                <h4>
                    Take full control of your lightning node. Think of something
                    else to place here. Think Think Think
                </h4>
                <h5>Available everywhere you can open a website.</h5>
                <button>Login</button>
            </LeftHeadline>
            <StyledImage />
            {/* {session ? (
                <SessionLogin />
            ) : login ? (
                <LoginView />
            ) : (
                <HomePageView setLogin={setLogin} />
            )} */}
        </Login>
    );
};

export default EntryView;
