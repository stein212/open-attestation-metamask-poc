# open-attestation-metamask-poc

## Usage
1. `yarn install`
1. `yarn serve`
1. Ensure metamask is installed in browser
1. Ensure that your metamask is on ropsten network and has some ropsten eth to use
1. Deploy a document store and change the code to use that as default
1. Ensure DNS for the document store is configured
1. Edit the default `document` to use the correct `identityProof`
1. Click `Wrap Document`
1. Click `Issue Document`
1. Wait for transaction hash to show up at the bottom of the page (will pop up after transation is successful)
1. Test the Wrapped Document at [dev.opencerts.io](https://dev.opencerts.io)

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
