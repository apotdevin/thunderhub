# **ThunderHub - Lightning Node Manager**

![Test and Build](https://github.com/apotdevin/thunderhub/workflows/Test%20and%20Build/badge.svg?branch=master)

![Home Screenshot](/docs/Home.png)
[![license](https://img.shields.io/github/license/DAVFoundation/captain-n3m0.svg?style=flat-square)](https://github.com/DAVFoundation/captain-n3m0/blob/master/LICENSE)

## Table Of Contents

- [Introduction](#introduction)
- [Integrations](#integrations)
- [Features](#features)
- [Installation](#installation)
- [Updating](#updating)
- [Development](#development)
- [Docker deployment](#docker)

---

## Introduction

ThunderHub is an **open-source** LND node manager where you can manage and monitor your node on any device or browser. It allows you to take control of the lightning network with a simple and intuitive UX and the most up-to-date tech stack.

---

### Integrations

**BTCPay Server**
ThunderHub is currently integrated into BTCPay for easier deployment. If you already have a BTCPay server and want to add ThunderHub or even want to start a BTCPay server from zero, be sure to check out this [tutorial](https://apotdevin.com/blog/thunderhub-btcpay)

**Raspiblitz**
For Raspiblitz users you can also get ThunderHub running by following this [gist](https://gist.github.com/openoms/8ba963915c786ce01892f2c9fa2707bc)

---

### Tech Stack

This repository consists of a **NextJS** server that handles both the backend **Graphql Server** and the frontend **React App**. ThunderHub connects to your Lightning Network node by using the gRPC ports.

- NextJS
- ReactJS
- Typescript
- Styled-Components
- Apollo
- Apollo-Server
- GraphQL
- Ln-Service

---

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

- LNURL integration: ln-pay and ln-withdraw are available. Ln-auth soon.
- Send and Receive Lightning payments.
- Send and Receive Bitcoin payments.
- Decode lightning payment requests.
- Open and close channels.
- Balance your channels through circular payments. ([Check out the Tutorial](https://apotdevin.com/blog/thunderhub-balancing))
- Update your all your channels fees or individual ones.
- Backup, verify and recover all your channels.
- Sign and verify messages.

### Visual

- Responsive UI for any device. Mobile, Tablet or Desktop.
- Light, Dark and Night mode.
- Check values in Bitcoin, Satoshis or Fiat.

### Accounts

- Connect to your node with **HEX/Base64 strings** or by passing the **file locations** of the macaroons and certificate.
- Manage however many nodes you want.
- Use a master password or individual passwords for each account.
- Passwords are hashed to avoid having them in cleartext form.

### Deployment

- Docker images for easier deployment

---

## **Requirements**

- NPM installed
- Node installed (Version 14.15 or higher)

---

## Config

You can define some environment variables that ThunderHub can start with. To do this create a `.env.local` (or use the template `.env`) file in the root directory with the following parameters:

**Important - If you want to use the `.env` template file and don't want it to be replaced after an update please duplicate and rename to `.env.local`**

```bash
# -----------
# Server Configs
# -----------
LOG_LEVEL = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly' # Default: 'info'
TOR_PROXY_SERVER='socks://127.0.0.1:9050' # Default: ''

# -----------
# Interface Configs
# -----------
THEME = 'dark' | 'light' | 'night' # Default: 'dark'
CURRENCY = 'sat' | 'btc' | 'fiat' # Default: 'sat'

# -----------
# Privacy Configs
# -----------
FETCH_PRICES = true | false # Default: true
FETCH_FEES = true | false # Default: true
DISABLE_LINKS = true | false # Default: false
DISABLE_LNMARKETS = true | false # Default: false
NO_VERSION_CHECK = true | false # Default: false
```

### TOR Requests

ThunderHub connects to different external services for example to fetch BOS scores, BTC/fiat prices and BTC blockchain fees. Normally they are done through clearnet but you can configure a TOR proxy server so that they are all proxied through TOR.

You need to add the following parameter into your `.env` file with your TOR endpoint:

```bash
TOR_PROXY_SERVER='socks://your.tor.endpoint' # i.e. 'socks://127.0.0.1:9050'
```

### SSO Account

You can define an account to work with SSO cookie authentication by adding the following parameters in the `.env` file:

```bash
# -----------
# SSO Account Configs
# -----------
COOKIE_PATH = '/path/to/cookie/file/.cookie' # i.e. '/data/.cookie'
SSO_SERVER_URL = 'url and port to node' # i.e. '127.0.0.1:10009'
SSO_CERT_PATH = '/path/to/tls/certificate' # i.e. '\lnd\alice\tls.cert'
SSO_MACAROON_PATH = '/path/to/macaroon/folder' # i.e. '\lnd\alice\data\chain\bitcoin\regtest\'
LOGOUT_URL = 'http://LogoutToThisUrl.com' # If not set it will logout to "/login"
```

To login to this account you must add the cookie file content to the end of your ThunderHub url. For example:

```
http://localhost:3000/sso?token=[COOKIE]
```

Replace `[COOKIE]` with the contents of the `.cookie` file.

### SSO Account without authentication

You can DANGEROUSLY remove SSO authentication. This is useful for example if you plan on running ThunderHub **only** on your local network or through TOR.

**DO NOT enable this option if your ThunderHub instance is available on the internet or your funds will probably be lost.**

The configuration for a non authenticated SSO account would look like this:

```bash
# -----------
# SSO Account Configs
# -----------
SSO_SERVER_URL = 'url and port to node'; # i.e. '127.0.0.1:10009'
SSO_CERT_PATH = '/path/to/tls/certificate'; # i.e. '\lnd\alice\tls.cert'
SSO_MACAROON_PATH = '/path/to/macaroon/folder'; # i.e. '\lnd\alice\data\chain\bitcoin\regtest\'
DANGEROUS_NO_SSO_AUTH = 'true' # Default: false
```

To login to this account go to the following url:

```
http://localhost:3000/sso?token=1
```

### Server Accounts

You can add accounts on the server by adding this parameter to the `.env` file:

```bash
# -----------
# Account Configs
# -----------
ACCOUNT_CONFIG_PATH = '/path/to/config/file.yaml'; # i.e. '/data/thubConfig.yaml'
```

You must also add a YAML file at that location with the following format:

```yaml
masterPassword: 'password' # Default password unless defined in account
accounts:
  - name: 'Account 1'
    serverUrl: 'url:port'
    macaroonPath: '/path/to/admin.macaroon'
    certificatePath: '/path/to/tls.cert'
    password: 'password for account 1'
  - name: 'Account 2'
    serverUrl: 'url:port'
    macaroonPath: '/path/to/admin.macaroon'
    certificatePath: '/path/to/tls.cert'
    # password: Leave without password and it will use the master password
  - name: 'Account 3'
    serverUrl: 'url:port'
    macaroon: '0201056...' # HEX or Base64 encoded macaroon
    certificate: '0202045c...' # HEX or Base64 encoded certificate
    password: 'password for account 3'
```

Notice you can specify either `macaroonPath` and `certificatePath` or `macaroon` and `certificate`.

#### Account with environment variables

It's possible to set different parts of the accounts based on environment variables.

You can use the following environment variables: `YML_ENV_1`, `YML_ENV_2`, `YML_ENV_3`, `YML_ENV_4` and fill your accounts in the following way:

```yaml
accounts:
  - name: '{YML_ENV_1}'
    serverUrl: '{YML_ENV_2}'
    macaroon: 'macaroonforthisaccount'
    certificate: '{YML_ENV_4}'
```

ThunderHub will take care of replacing the fields with the correct environment variables. The `{YML_ENV_[1-4]}` can only be used for fields inside the accounts. So for example using it for the `masterPassword` will not work.

#### Account with LND directory

You can also specify the main LND directory and ThunderHub will look for the certificate and the macaroon in the default folders (based on the network).

Default folders (assuming LND is at path `/lnd`):

- Certificate: `/lnd/tls.cert`
- Macaroon: `/lnd/data/chain/bitcoin/[mainnet | testnet | regtest]/admin.macaroon`

The YAML file for this example would be:

```yaml
masterPassword: 'password' # Default password unless defined in account
defaultNetwork: 'testnet' # Default network unless defined in account
accounts:
  - name: 'Account1'
    serverUrl: 'url:port'
    # network: Leave without network and it will use the default network
    lndDir: '/path/to/lnd'
  - name: 'Account2'
    serverUrl: 'url:port'
    network: 'mainnet'
    lndDir: '/path/to/lnd'
```

If you don't specify `defaultNetwork` then `mainnet` is used as the default.

#### Encrypted Macaroons

You can use AES encrypted macaroons and have ThunderHub decrypt them and store them in memory. This allows you to have encrypted macaroons on your server and avoid having them in cleartext.

Macaroons should be AES encrypted. This is an example for Javascript:

```js
const encrypted = CryptoJS.AES.encrypt(
  'Hex or Base64 encoded Macaroon',
  'Secret Passphrase'
).toString();
```

You can use the `macaroonPath` field and let ThunderHub look for the file or directly use the `macaroon` field and paste your encrypted macaroon.

You must let ThunderHub know that the macaroon is encrypted by adding an `encrypted` field to your account like such:

```yaml
masterPassword: 'password'
accounts:
  - name: 'Account 1'
    serverUrl: 'url:port'
    macaroonPath: '/path/to/encrypted.admin.macaroon'
    encrypted: true # This field is necessary
  - name: 'Account 2'
    serverUrl: 'url:port'
    macaroon: 'EnCrYpTeD-MaCaRoOn'
    encrypted: true # This field is necessary
```

To login you must use the same secret passphrase that you used to encrypt the macaroon.

#### Security

On the first start of the server, the `masterPassword` and all account `password` fields will be **hashed** and the file will be overwritten with these new values to avoid having cleartext passwords on the server.

### Privacy Configs

**Prices and Fees**
ThunderHub fetches fiat prices from [Blockchain.com](https://blockchain.info/ticker)'s api and bitcoin on chain fees from [Earn.com](https://bitcoinfees.earn.com/api/v1/fees/recommended)'s api.

If you want to deactivate these requests you can set `FETCH_PRICES=false` and `FETCH_FEES=false` in your `.env` file or manually change them inside the settings view of ThunderHub.

**LnMarkets**
ThunderHub can connect to the LnMarkets API. You can disable this option by setting `DISABLE_LNMARKETS=true` in your `.env` file.

**Links**
ThunderHub shows you links for quick viewing of nodes by public key on [1ml.com](https://1ml.com/) and for viewing onchain transactions on [Blockchain.com](https://www.blockchain.com/).

If you don't want to show these links, you can set `DISABLE_LINKS=true` in your `.env` file.

**Version Check**
ThunderHub gets the latest available version from [Github](https://api.github.com/repos/apotdevin/thunderhub/releases/latest) and shows you a message if you are on an older version.

If you want to disable this option you can set `NO_VERSION_CHECK=true` in your `.env` file.

### Running on different base path

Adding a BASE_PATH will run the ThunderHub server on a different base path.

```bash
# -----------
# Server Configs
# -----------
BASE_PATH = '[Base path where you want to have thunderhub running i.e. '/btcpay']' # Default: ''
```

For example:

- by default ThunderHub runs on `http://localhost:3000`
- base path of `/thub` runs ThunderHub on `http://localhost:3000/thub`

**You need to add this environment variable BEFORE building the application**

There is a prebuilt [Docker](https://hub.docker.com/repository/docker/apotdevin/thunderhub) image with a preset `BASE_PATH=/thub` in case you need it and prefer not building your own Docker image.

```bash
# Normal docker image
docker pull apotdevin/thunderhub:v0.11.1

# Preset basePath docker image
docker pull apotdevin/thunderhub:base-v0.11.1
```

To build your own docker image with the `basePath` of your choice you can use `docker build --build-arg BASE_PATH='/thub' -t myOwnDockerImage .`

You can run ThunderHub behind a proxy with the following configuration (NGINX example):

```nginx
location /thub {
  proxy_pass http://localhost:3000/thub;
}
```

---

## Installation

To run ThunderHub you first need to clone this repository.

```js
git clone https://github.com/apotdevin/thunderhub.git
```

After cloning the repository run `yarn` or `npm install` to get all the necessary modules installed.

After all the dependencies have finished installing, you can proceed to build and run the app with the following commands.

```javascript
// Yarn
yarn build
yarn start

// NPM
npm run build
npm start
```

This will start the server on port 3000, so just go to `localhost:3000` to see the app running.

If you want to specify a different port (for example port `4000`) run with:

```js
// Yarn
yarn start -p 4000

// NPM
npm start -- -p 4000
```

For **PRODUCTION**, if you want to reduce the space taken up by ThunderHub you can run `npm prune --production` after the build is completed.

---

## Updating

There are multiple ways to update ThunderHub to it's latest version.

_Commands have to be called inside the thunderhub repository folder._

**1. Script Shortcut**

```sh
// Yarn
yarn update

// NPM
npm run update
```

**2. Script**

```sh
sh ./scripts/updateToLatest.sh
```

**3. Step by Step**

```sh
// Yarn
git pull
yarn
yarn build

// NPM
git pull
npm install
npm run build
```

**Then you can start your server:**

```sh
// Yarn
yarn start

// NPM
npm run start
```

---

## Development

If you want to develop on ThunderHub and want hot reloading when you do changes, use the following commands:

```js
//Yarn
yarn dev

//NPM
npm run dev
```

---

## Docker

ThunderHub also provides docker images for easier deployment. [Docker Hub](https://hub.docker.com/repository/docker/apotdevin/thunderhub)

To get ThunderHub running with docker follow these steps:

1. `docker pull apotdevin/thunderhub:v0.11.1` (Or the latest version you find)
2. `docker run --rm -it -p 3000:3000/tcp apotdevin/thunderhub:v0.5.5`

You can now go to `localhost:3000` to see your running instance of ThunderHub

## SSL Certificates

Thunderhub has the ability to automatically provision SSL certificates for itself via [ZeroSSL](https://zerossl.com). In order to use this, you must configure the `SSL Config` section of the [`.env`](.env) file. To options are as follows:

- `PUBLIC_URL` is the publicly reachable URL that Thunderhub would be servered from.

- `SSL_PORT` is the port the Certificate Validation server will run on. This _must_ either be running on port `80` or you must proxy this port to port `80` with something like Nginx.

- `SSL_SAVE` specifies whether you want Thunderhub to save the generate SSL private key and certificate to disk or not.

You must also specify your ZeroSSL API key either in the [`.env`](.env) file or export it as an environment variable:

```
$ export ZEROSSL_API_KEY="a1b2c3d4e5f6g7h8i9"
```

Once you have Thunderhub configured you can start the secure server with:

```
$ npm run start:secure
```

This will request a certificate from ZeroSSL for the given `PUBLIC_URL` and serve the HTTP challenge via the Certificate Validation server. Once the certificate is verified and issued, Thunderhub downloads the certificate and shuts down the Certificate Validation server. Then it will bring up the Thunerhub web server and use the newly provisioned SSL certificates.
