# **ThunderHub - Lightning Node Manager**

![Home Screenshot](./docs/Home.png)
[![license](https://img.shields.io/github/license/DAVFoundation/captain-n3m0.svg?style=flat-square)](https://github.com/DAVFoundation/captain-n3m0/blob/master/LICENSE)

## Table Of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Development](#development)

## Introduction

ThunderHub is an **open-source** LND node manager where you can manage and monitor your node on any device or browser. It allows you to take control of the lightning network with a simple and intuitive UX and the most up-to-date tech stack.

### Tech Stack

This repository consists of a **NextJS** server that handles both the backend **Graphql Server** and the frontend **React App**.

- NextJS
- ReactJS
- Typescript
- Styled-Components
- Apollo
- Apollo-Server
- GraphQL
- Ln-Service

## Features

### Monitoring

- Overview of current and pending balance for the Lightning and Bitcoin wallets.
- URI strings for the node (Onion public uri also if available)
- Invoice and Payment graph.
- Liquidity report with total remote and local lightning balance.
- Forwarded payments graph and the routes used for these payments.
- Complete network info.
- View open/pending/closed channels and how balanced they are.
- View channel base and rate fees.
- View all transactions.
- View all forwarded payments.
- View all chain transactions.
- View all unspent UTXOS.

### Management

- Send and Receive Lightning payments.
- Send and Receive Bitcoin payments.
- Decode lightning payment requests.
- Open and close channels.
- Balance your channels through circular payments. ([Check out the Tutorial](https://medium.com/coinmonks/lightning-network-channel-balancing-with-thunderhub-972b41bf9243))
- Update your all your channels fees or individual ones.
- Backup, verify and recover all your channels.
- Sign and verify messages.

### Visual

- Responsive UI for any device. Mobile, Tablet or Desktop.
- Light and Dark mode.
- Check values in Bitcoin, Satoshis or Fiat.

### Accounts

- Many ways to connect to your node: **HEX/Base64 strings**, **LNDConnect Url**, **BTCPayServer Info** or **QR codes**.
- Have view-only and/or admin accounts.
- Manage however many accounts your browser storage can hold.
- Quickly sync your accounts between devices. No need to copy/paste macaroons and certificates.

### Deployment

- Docker images for easier deployment (WIP)

### Future Features

- Loop In and Out to provide liquidity or remove it from your channels.
- Integration with HodlHodl
- Storefront interface

## Installation

To run ThunderHub you first need to clone this repository.

```javascript
git clone https://github.com/apotdevin/thunderhub.git
```

### **Requirements**

- Node installed
- Yarn installed

After cloning the repository run `yarn` to get all the necessary modules installed.

After `yarn` has finished installing all the dependencies you can proceed to build and run the app with the following commands.

```javascript
yarn build
yarn start
```

This will start the server on port 3000, so just head to `localhost:3000` to see the app running.

#### HodlHodl Integration

To be able to use the HodlHodl integration create a `.env` file in the root folder with `HODL_KEY='[YOUR API KEY]'` and replace `[YOUR API KEY]` with the one that HodlHodl provides you.

## Development

If you want to develop on ThunderHub and want hot reloading when you do changes, use the following commands:

```javascript
yarn dev
```

#### Storybook

You can also get storybook running for quicker component development.

```javascript
yarn storybook
```
