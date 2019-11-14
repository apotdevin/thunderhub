import React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router";
import { Home } from "../../views/home/Home";
import { NotFound } from "../../views/notFound/NotFound";
import { ChannelView } from "../../views/channels/ChannelView";
import { InvoiceView } from "../../views/invoices/InvoiceView";

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
        <Route path="/invoices" render={() => <InvoiceView />} />
        <Route path="*" render={() => <NotFound />} />
      </Switch>
    </ContentStyle>
  );
};
