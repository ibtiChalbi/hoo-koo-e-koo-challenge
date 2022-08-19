<div align="center">
  <h1>challenge</h1>
</div>

> ### An application that allow user to connect via metamask, send transactions, setup MultiSig wallet.




## Getting started

Before starting, please make sure That you have the [MetaMak chrome extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) installed adn ready to go.

### Requirements

- [Node.js®](https://nodejs.org/en/) - the JavaScript runtime


### Start development servers

The application is divided into two services: the `api` and the `www`. It is necessary to spin up both services to start the development process effectively. Open **two** terminal windows and enter the following commands:

```sh
yarn start:dev # starts the development `api` server
yarn start # starts the development `www` server
```

## Architecture


### Tech stack

The entire system is built on the _Node.js®_ runtime and written in _TypeScript_.

- [Node.js®](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)

The `api` service is a _Nest.js_ application. Is scalable Node.js server-side applications, aims to connect the application to _MongoDB_.

- [Nest.js](https://nestjs.com/)
- [MongoDB](https://docs.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

The native frontend – the `www` – is a _Reactjs_ application. It uses _Material-UI_ as a user interface library.

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/material-ui)


---

# Points to improve
- saving the multisig data into the MongoDB
- better use of the custom hooks is recommended at this Points
-  Add confirm/reject transactions in the safe
-  Allow user to auto connect to other account in order to use correctly the multi sign