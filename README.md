# Tranche Finance Frontend

## Overview

This repository contains the core frontend code of tranche.finance staking and profit sharing defi platfrom.

## Setup

Be sure to have at least npm v8.\*. If it is not the case, run the following command (Optional):

```
npm install -g npm@latest
```

Step1: run the following command to use the node version required by the application:

```
nvm use
```

### Application setup and installing node modules

Step2: install and run the frontend locally, run the following command:

```
npm install
```

This step is going to automatically trigger a postinstall hook to initialize and build the API layer using git submodules.

### Setup Parameters

You can use these parameters in your `.env` file, copy the env blueprint file `.env.sample` to `.env` and update the values accordingly.

Whenever a new variable is added or introduced into the application code, you need to update `.env.sample` for tracking purposes

| Parameter      | Required | Description                                                         |
| -------------- | -------- | ------------------------------------------------------------------- |
| REACT_APP_PORT | No       | The port used to run your application on localhost, default is 3000 |

## Starting the server

Step3: To start the application in development mode, run the command:

```
npm start
```

You can access the server at http://localhost:3000/

## Documentation

### Deployed

This repository is deployed at the following addresses:

| Environment | URL                                  |
| ----------- | :----------------------------------- |
| Development | https://dev.tranche.finance/tranche/ |
| Production  | https://tranche.finance/             |

## Development

Here are some useful commands to use (COMING SOON):

```
npm run prettier # Run prettier and fix issues
npm run lint # Run linter and fix issues
npm run test # runs unit tests
npm run test:cov # analyzes the coverage of your unit tests
```

### Linting in VSCode

Open your Visual Studio Code User's settings/preferences as JSON and put in the following configuration:

```json
// Set the default
"editor.formatOnSave": false,
// Enable per-language
"[javascript]": {
    "editor.formatOnSave": true
}
```
