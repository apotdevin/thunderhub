import React, { useContext } from "react";
import styled, { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyle";
import { Header } from "./sections/header/Header";
import { Footer } from "./sections/footer/Footer";
import { Navigation } from "./sections/navigation/Navigation";
import { Content } from "./sections/content/Content";
import { ApolloProvider } from "@apollo/react-hooks";
import { BrowserRouter } from "react-router-dom";
import ApolloClient from "apollo-boost";
import SettingsProvider, { SettingsContext } from "./context/SettingsContext";

const client = new ApolloClient({
  uri: "http://localhost:3001"
});

const Container = styled.div`
  display: grid;
  grid-template-areas:
    "header header header"
    "nav content content"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 10px;
  height: 100vh;
`;

const ContextApp: React.FC = () => {
  const { theme } = useContext(SettingsContext);

  return (
    <ThemeProvider theme={{ mode: theme }}>
      <GlobalStyles />
      <Container>
        <Header />
        <Navigation />
        <Content />
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <SettingsProvider>
          <ContextApp />
        </SettingsProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default App;
