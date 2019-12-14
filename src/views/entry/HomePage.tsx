import React from 'react';

interface HomePageProps {
    setLogin: (login: boolean) => void;
}

export const HomePageView = ({ setLogin }: HomePageProps) => {
    return (
        <div>
            THIS IS THE BEST WEBSITE EVER
            <button onClick={() => setLogin(true)}>Login</button>
        </div>
    );
};
