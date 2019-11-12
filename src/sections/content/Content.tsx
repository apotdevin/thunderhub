import React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router";
import { Home } from "../../views/home/Home";
import { NotFound } from "../../views/notFound/NotFound";

const ContentStyle = styled.div`
  /* display: flex;
	justify-content: center;
	align-items: center; */
  padding: 10px;
  /* background-color: blue; */
  grid-area: content;
  margin-right: 0.5rem;
`;

export const Content = () => {
  return (
    <ContentStyle>
      <Switch>
        <Route exact path="/" render={() => <Home />} />
        <Route path="*" render={() => <NotFound />} />
      </Switch>
    </ContentStyle>
  );
};
